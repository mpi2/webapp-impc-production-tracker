import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { ConfigurationData, ConfigurationDataService, LoggedUserService } from 'src/app/core';
import {  MatDialog, MatSidenav } from '@angular/material';
import { SearchService, Search, SearchType } from '../..';
import { SearchResult } from '../../model/search.result';
import { ProjectIntention } from 'src/app/model/bio/project-intention';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, share, startWith } from 'rxjs/operators';
import { FilterDefinition } from 'src/app/feature-modules/filters/model/filter-definition';
import { FilterService } from 'src/app/feature-modules/filters/services/filter.service';
import { SearchFilter } from '../../model/search-filter';
import { FilterType } from 'src/app/feature-modules/filters/model/filter-type';
import { SearchInput, SearchInputType } from '../../model/search-input';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('drawer', { static: false }) drawer: MatSidenav;

  dataSource: SearchResult[];

  configurationData: ConfigurationData;
  filterVisible = false;
  filtersDefinition: FilterDefinition[];
  filters: SearchFilter;
  inputsByText: string[] = [];
  error;
  downloading = false;
  isLoading = true;
  filterChangesSubscription;

  currentSearch: Search = new Search();

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
    this.setInitialSearchInformation();
    this.configurationDataService.getConfigurationData().subscribe(data => {
      this.configurationData = data;
      this.setupFilters();
    });
    this.isLoading = true;
  }

  setInitialSearchInformation() {
    this.currentSearch.searchType = SearchType.Gene;
    const searchInput: SearchInput = new SearchInput();
    searchInput.type = SearchInputType.Text;
    this.currentSearch.searchInput = searchInput;
  }

  ngAfterViewInit() {
    this.filterChangesSubscription =
      this.filterService.filterChange.subscribe(filters => {
        this.filters = filters;
        this.currentSearch.filters = filters;
        this.searchService.emitSearchChange(this.currentSearch);
      });
  }

  ngOnDestroy() {
    this.filterChangesSubscription.unsubscribe();
  }

  toogleShowFilters() {
    this.filterVisible = !this.filterVisible;
  }

  setupFilters() {
    const workUnitNames: NamedValue[] = this.configurationData.workUnits.map(x => ({ name: x }));
    const privaciesNames: NamedValue[] = this.configurationData.privacies.map(x => ({ name: x }));
    this.filtersDefinition = [
      {
        title: 'Work Units',
        name: 'workUnitNames',
        type: FilterType.Checkboxes,
        dataSource: workUnitNames
      },
      {
        title: 'Privacies',
        name: 'privacyNames',
        type: FilterType.Checkboxes,
        dataSource: privaciesNames
      }
    ];
  }

  onSearchDefined(e) {
   this.currentSearch.searchInput = e;
   this.searchService.emitSearchChange(this.currentSearch);
   console.log('this.currentSearch', this.currentSearch);
  }

  downloadCsv() {
    this.downloading = true;
    const search = this.buildSearch();
    this.searchService.exportCsv(search).subscribe(data => {
      this.download('searchResults.csv', data);
      this.downloading = false;
      this.error = '';
    },
      error => {
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

  private buildSearch() {
    if (!this.loggedUserService.getLoggerUser()) {
      this.currentSearch.filters.privacy = ['public'];
    }
    return this.currentSearch;
  }

  buildSearchResultComments(searchResult: SearchResult): void {
    const result = [];
    result.push(searchResult.comment);
    if (!searchResult.project) {
      result.push('No projects found');
    }
    searchResult.searchResultComments = result;
  }

  getTargetText(projectIntention: ProjectIntention): string {
    let text = '';
    const intentionByGene = projectIntention.intentionByGene;
    if (intentionByGene && intentionByGene.gene) {
      text = intentionByGene.gene.symbol;
      return text;
    }
  }

  onErrorMessageChanged(e) {
    this.error = e;
  }
}
