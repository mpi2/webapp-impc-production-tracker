import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ConfigurationData, ConfigurationDataService, LoggedUserService } from 'src/app/core';
import { MatPaginator, MatSort, MatDialog, MatSidenav } from '@angular/material';
import { SearchService, Search } from '../..';
import { SearchResult } from '../../model/search.result';
import { InformativeDialogComponent } from 'src/app/shared/components/informative-dialog/informative-dialog.component';
import { ProjectIntention } from 'src/app/model/bio/project-intention';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, share, startWith } from 'rxjs/operators';
import { FilterDefinition } from 'src/app/feature-modules/filters/model/filter-definition';
import { FilterService } from 'src/app/feature-modules/filters/services/filter.service';

class CheckboxElement implements NamedValue {
  name: string;
  isSelected: boolean;
}

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

  displayedColumns: string[] = ['Search term', 'Project summary', 'Allele Intentions', 'Gene Symbol / Location', 'Best Ortholog',
    'Project Assignment'];
  selectAllWorkUnits = true;
  panelOpenState = false;
  searchForm: FormGroup;
  searchControl = new FormControl();
  page: any = {};
  workUnits: CheckboxElement[] = [];
  workGroups: CheckboxElement[] = [];
  searchTypes: string[] = ['gene'];
  masterSelected: boolean;
  checkedList: any;
  myTextarea: string;
  configurationData: ConfigurationData;
  filterVisible = false;
  filters: FilterDefinition[];

  error;
  isLoading = true;
  isRateLimitReached = false;

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
    this.getPage(0, {});
  }

  ngAfterViewInit() {
    this.filterService.filterChange.subscribe(filters => {
      this.getPage(0, filters);
    });
  }

  toogleShowFilters() {
    this.filterVisible = !this.filterVisible;
  }

  setupFilters() {
    const workUnitNames: NamedValue[] = this.configurationData.workUnits.map(x => ({ name: x }));
    this.filters = [
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
    this.getPage(0, this.filters);
  }

  onInputTextChanged(e) {
    this.inputSearchDefinition = { type: 'text', value: e };
  }

  onInputFileSelected(e) {
    this.inputSearchDefinition = { type: 'file', value: e };
  }

  public getPage(pageNumber: number, filters): void {
    const search: Search = new Search();
    search.filters = filters;
    search.inputDefinition = this.inputSearchDefinition ? this.inputSearchDefinition : ({ type: 'text' });
    search.searchType = this.getSearchType();
    if (!this.loggedUserService.getLoggerUser()) {
      search.setPrivacies(['public']);
    }
    this.searchService.executeSearch(search, pageNumber).subscribe(data => {
      this.error = '';
      this.isLoading = false;
      this.processResponseData(data);
    }, error => {
      this.error = error;
      this.isLoading = false;
    });
  }

  private processResponseData(data: SearchResult[]) {
    /* tslint:disable:no-string-literal */
    this.dataSource = data['results'];
    this.dataSource.map(x => this.buildSearchResultComments(x));
    this.refreshVisibleColumns();
    this.page = data['page'];
    /* tslint:enable:no-string-literal */
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
      this.displayedColumns = ['Project summary', 'Allele Intentions', 'Gene Symbol / Location', 'Best Ortholog',
        'Project Assignment', 'Privacy', 'Access Restriction'];
    } else {
      this.displayedColumns = ['Search term', 'Search Result Comments', 'Project summary', 'Allele Intentions', 'Gene Symbol / Location',
        'Best Ortholog', 'Project Assignment', 'Privacy', 'Access Restriction'];
    }
  }

  private getSearchType(): string {
    return this.selectedSearchType;
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
      }
    }
    return [];
  }

  checkUncheckWorkUnits(e) {
    for (const workUnit of this.workUnits) {
      const selector = '#' + this.getIdFromWorkUnitName(workUnit.name);
      const htmlElement = document.querySelector(selector) as HTMLInputElement;
      htmlElement.checked = e.target.checked;
      workUnit.isSelected = e.target.checked;
    }
  }

  checkUncheckWorkGroups(e) {
    for (const workGroup of this.workGroups) {
      const selector = '#' + this.getIdFromWorkGroupName(workGroup.name);
      const htmlElement = document.querySelector(selector) as HTMLInputElement;
      htmlElement.checked = e.target.checked;
      workGroup.isSelected = e.target.checked;
    }
  }

  onCheckedWorkUnitElement(element: any) {
    const isSelected = !element.isSelected;
    element.isSelected = isSelected;
    const workUnitSelectAll = document.querySelector('#workUnitsSelectAll') as HTMLInputElement;
    workUnitSelectAll.checked = this.workUnits.filter(x => x.isSelected).length === this.workUnits.length;

    return isSelected;
  }

  onCheckedWorkGroupElement(element: any) {
    const isSelected = !element.isSelected;
    element.isSelected = isSelected;
    const workGroupSelectAll = document.querySelector('#workGroupsSelectAll') as HTMLInputElement;
    workGroupSelectAll.checked = this.workGroups.filter(x => x.isSelected).length === this.workGroups.length;

    return isSelected;
  }

  private validSearch(): boolean {
    let isValid = true;
    const input = this.getGeneSymbolsAsArray();
    if (input.length > 0) {
      if (!this.selectedSearchType) {
        isValid = false;
        const dialogRef = this.dialog.open(InformativeDialogComponent, {
          width: '250px',
          data: {
            title: 'Please select a search type',
            text: 'As you have defined an input for the search (' + input + '), you need to stablish a search type.'
          }
        });

        dialogRef.afterClosed().subscribe(result => {
        });
      } else {
        isValid = true;
      }
    }

    return isValid;
  }

  getIdFromWorkUnitName(workUnitName: string) {
    return 'workUnit_' + workUnitName.replace(/\W/g, '_');
  }

  getIdFromWorkGroupName(workGroupName: string) {
    return 'workGroup_' + workGroupName.replace(/\W/g, '_');
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
