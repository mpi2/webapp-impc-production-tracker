import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ConfigurationData, ConfigurationDataService, LoggedUserService } from 'src/app/core';
import { MatPaginator, MatSort, MatDialog, MatSidenav } from '@angular/material';
import { SearchService, Search } from '../..';
import { SearchResult } from '../../model/search.result';
import { ProjectIntention } from 'src/app/model/bio/project-intention';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, share, startWith } from 'rxjs/operators';
import { FilterDefinition } from 'src/app/feature-modules/filters/model/filter-definition';
import { FilterService } from 'src/app/feature-modules/filters/services/filter.service';
import { Page } from 'src/app/model/page_structure/page';
import { SearchFilter } from '../../model/search-filter';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('drawer', { static: false }) drawer: MatSidenav;

  selectedSearchType = 'gene';
  inputSearchDefinition: any = undefined;
  dataSource: SearchResult[];
  displayedColumns: string[] = [];
  page: Page = { number: 0, size: 20 };
  searchTypes: string[] = ['gene'];
  configurationData: ConfigurationData;
  filterVisible = false;
  filtersDefinition: FilterDefinition[];
  filters: SearchFilter;
  inputsByText: string[] = [];
  error;
  downloading = false;
  isLoading = true;

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      share(),
      startWith(false)
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private searchService: SearchService,
    private configurationDataService: ConfigurationDataService,
    private loggedUserService: LoggedUserService,
    private filterService: FilterService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.configurationDataService.getConfigurationData().subscribe(data => {
      this.configurationData = data;
      this.setupFilters();
    });
    this.isLoading = true;
    this.getPage(this.page, {});
  }

  ngAfterViewInit() {
    this.filterService.filterChange.subscribe(filters => {
      this.filters = filters;
      this.getPage(this.page, filters);
    });
  }

  toogleShowFilters() {
    this.filterVisible = !this.filterVisible;
  }

  setupFilters() {
    const workUnitNames: NamedValue[] = this.configurationData.workUnits.map(x => ({ name: x }));
    this.filtersDefinition = [
      {
        title: 'Work Units',
        name: 'workUnitName',
        type: 'checkboxes',
        dataSource: workUnitNames
      }
    ];
  }

  onSearchDefined(e) {
    this.inputSearchDefinition = e;
    this.getPage(this.page, this.filtersDefinition);
  }

  onInputTextChanged(e) {
    this.inputSearchDefinition = { type: 'text', value: e };
  }

  onInputFileSelected(e) {
    this.inputSearchDefinition = { type: 'file', value: e };
  }

  downloadCsv() {
    this.downloading = true;
    const search =  this.buildSearch();
    this.searchService.exportCsv(search).subscribe(data => {
      this.download('searchResults.csv', data);
      this.downloading = false;
      this.error = '';
    },
      error =>  {
        this.error = error;
        this.downloading = false;
      }
    );
  }

  download(filename, text) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  public getPage(page: Page, filters): void {
    this.isLoading = true;
    const search: Search = new Search();
    search.filters = filters;
    search.inputDefinition = this.inputSearchDefinition ? this.inputSearchDefinition : ({ type: 'text' });
    search.searchType = this.getSearchType();
    if (!this.loggedUserService.getLoggerUser()) {
      search.setPrivacies(['public']);
    }
    this.searchService.executeSearch(search, page).subscribe(data => {
      this.error = '';
      this.isLoading = false;
      this.processResponseData(data);
    }, error => {
      this.error = error;
      this.isLoading = false;
    });
  }

  private buildSearch() {
    const search: Search = new Search();
    search.filters = this.filters;
    search.inputDefinition = this.inputSearchDefinition ? this.inputSearchDefinition : ({ type: 'text' });
    search.searchType = this.getSearchType();
    if (!this.loggedUserService.getLoggerUser()) {
      search.setPrivacies(['public']);
    }
    return search;
  }

  public onPaginatorChanged(paginator: MatPaginator) {
    this.page.number = paginator.pageIndex;
    this.page.size = paginator.pageSize;
    this.getPage(this.page, this.filtersDefinition);
  }

  private processResponseData(data: SearchResult[]) {
    /* tslint:disable:no-string-literal */
    this.dataSource = data['results'];
    this.dataSource.map(x => this.buildSearchResultComments(x));
    this.updateInputIfSearchedByFile();
    this.refreshVisibleColumns();
    this.page = data['page'];
    console.log('this.dataSource ', this.dataSource);
    /* tslint:enable:no-string-literal */
  }

  private updateInputIfSearchedByFile() {
    if (this.getSearchDefinitionType() === 'file') {
      this.inputsByText = this.dataSource.map(x => x.input);
    }
  }

  buildSearchResultComments(searchResult: SearchResult): void {
    const result = [];
    result.push(searchResult.comment);
    if (!searchResult.project) {
      result.push('No projects found');
    }
    searchResult.searchResultComments = result;
  }

  private refreshVisibleColumns(): void {
    if (this.getGeneSymbolsAsArray().length === 0) {
      this.displayedColumns = ['Project summary', 'Allele Intentions', 'Gene Symbol / Location', 'Best human ortholog',
        'Project Assignment', 'Privacy', 'Access Restriction'];
    } else {
      this.displayedColumns = ['Search term', 'Search Result Comments', 'Project summary', 'Allele Intentions', 'Gene Symbol / Location',
        'Best human ortholog', 'Project Assignment', 'Privacy', 'Access Restriction'];
    }
  }

  private getSearchType(): string {
    return this.selectedSearchType;
  }

  private getSearchDefinitionType(): string {
    let type;
    if (this.inputSearchDefinition) {
      type = this.inputSearchDefinition.type;
    }
    return type;
  }

  getGeneSymbolsAsArray(): string[] {
    if (this.inputSearchDefinition) {
      if (this.inputSearchDefinition.type === 'text') {
        const input: string = this.inputSearchDefinition.value;
        if (input !== '') {
          const geneSymbols = input.split(',');
          geneSymbols.map(x => x.trim());
          return geneSymbols;
        }
      } else {
        return this.inputsByText;
      }
    }
    return [];
  }

  getTargetText(projectIntention: ProjectIntention): string {
    let text = '';
    if ('gene' === projectIntention.intentionTypeName) {
      const intentionByGene = projectIntention.intentionByGene;
      if (intentionByGene && intentionByGene.gene) {
        text = intentionByGene.gene.symbol;
      }
      return text;
    }
  }
}
