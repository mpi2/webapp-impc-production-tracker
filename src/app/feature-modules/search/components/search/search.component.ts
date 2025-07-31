import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ConfigurationData, ConfigurationDataService, LoggedUserService } from 'src/app/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { SearchService, Search, SearchType } from '../..';
import { SearchResult } from '../../model/search.result';
import { ProjectIntention } from 'src/app/feature-modules/projects/model/project-intention';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, share, startWith } from 'rxjs/operators';
import { FilterDefinition } from 'src/app/feature-modules/filters/model/filter-definition';
import { FilterService } from 'src/app/feature-modules/filters/services/filter.service';
import { SearchFilter } from '../../model/search-filter';
import { FilterType } from 'src/app/feature-modules/filters/model/filter-type';
import { SearchInput, SearchInputType } from '../../model/search-input';
import { Router, ActivatedRoute } from '@angular/router';
import { NamedValue } from 'src/app/core/model/common/named-value';


@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.css'],
    standalone: false
})
export class SearchComponent implements OnInit, OnDestroy {

  @ViewChild('drawer') drawer: MatSidenav;

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
  filtersInitialValues: any;
  configurationLoaded = false;

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
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.setInitialSearchInformation();
    this.configurationDataService.getConfigurationData().subscribe(data => {
      this.configurationData = data;
      this.setInitialValuesForFilters();
      this.setupFilters();
      this.configurationLoaded = true;
    });
    this.isLoading = true;

    this.subscribeToFilterChanges();

  }

  setInitialSearchInformation() {
    this.currentSearch.searchType = SearchType.Gene;
    const searchInput: SearchInput = new SearchInput();
    searchInput.type = SearchInputType.Text;
    this.currentSearch.searchInput = searchInput;
  }

  ngOnDestroy() {
    this.filterChangesSubscription.unsubscribe();
  }

  toogleShowFilters() {
    this.filterVisible = !this.filterVisible;
  }

  setupFilters() {
    const workUnitNames: NamedValue[] = this.configurationData.workUnits.map(x => ({ name: x }));
    const workGroupNames: NamedValue[] = this.configurationData.workGroups.map(x => ({ name: x }));
    const privaciesNames: NamedValue[] = this.configurationData.privacies.map(x => ({ name: x }));
    const consortiaNames: NamedValue[] = this.configurationData.consortia.map(x => ({ name: x }));
    const intentionNames: NamedValue[] = this.configurationData.molecularMutationTypes.map(x => ({ name: x }));
    const summaryStatuses: NamedValue[] = this.configurationData.statuses.map(x => ({ name: x }));
    this.filtersDefinition = [
      {
        title: 'TPN',
        name: 'tpn',
        type: FilterType.text
      },
      {
        title: 'Allele Intention',
        name: 'intentionTypeName',
        type: FilterType.checkboxes,
        dataSource: intentionNames
      },
      {
        title: 'Work Unit',
        name: 'workUnitName',
        type: FilterType.checkboxes,
        dataSource: workUnitNames
      },
      {
        title: 'Work Group',
        name: 'workGroupName',
        type: FilterType.checkboxes,
        dataSource: workGroupNames
      },
      {
        title: 'Consortium',
        name: 'consortiumName',
        type: FilterType.checkboxes,
        dataSource: consortiaNames
      },
      {
        title: 'Privacy',
        name: 'privacyName',
        type: FilterType.checkboxes,
        dataSource: privaciesNames
      }
      ,
      {
        title: 'Summary Status',
        name: 'summaryStatusName',
        type: FilterType.checkboxes,
        dataSource: summaryStatuses
      }
    ];
  }

  onSearchDefined(e) {
    this.currentSearch.searchInput = e;
    this.searchService.emitSearchChange(this.currentSearch);
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

  setInitialValuesForFilters() {
    const currentParameters = this.activatedRoute.snapshot.queryParams;
    this.filtersInitialValues = currentParameters;
  }

  private subscribeToFilterChanges() {
    this.filterChangesSubscription = this.filterService.filterChange.subscribe(filters => {
      this.filters = filters;
      this.currentSearch.filters = filters;
      const validatedFilters = this.filterService.buildValidFilter(filters);

      this.updateUrlWithFilters(validatedFilters);
      this.searchService.emitSearchChange(this.currentSearch);
    });
  }

  private buildSearch() {
    if (!this.loggedUserService.getLoggerUser()) {
      this.currentSearch.filters.privacy = ['public'];
    }
    return this.currentSearch;
  }

  private updateUrlWithFilters(filters) {
    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: filters,
        replaceUrl: true
      }
    );
  }

}
