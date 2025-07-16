import { Component, OnInit, Input, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { SearchResult } from '../../model/search.result';
import { Page } from 'src/app/model/page_structure/page';
import { Search, SearchService } from '../..';
import { LoggedUserService } from 'src/app/core';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { Sort } from 'src/app/model/page_structure/sort';
import { ProjectIntention } from 'src/app/feature-modules/projects/model/project-intention';

@Component({
    selector: 'app-search-content',
    templateUrl: './search-content.component.html',
    styleUrls: ['./search-content.component.css'],
    standalone: false
})
export class SearchContentComponent implements OnInit, OnDestroy {
  @Input() search: Search;
  @Output() errorMessageChanged = new EventEmitter<string>();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  dataSource: SearchResult[];
  sort: Sort = { property: 'tpn', direction: 'ASC'};
  // eslint-disable-next-line id-blacklist
  page: Page = { number: 0, size: 20, sorts: [this.sort]};
  isLoading = true;
  displayedColumns: string[] = [];
  searchSubscription: Subscription;

  constructor(
    private loggedUserService: LoggedUserService,
    private searchService: SearchService) { }

  ngOnInit() {
    this.subscribeToSearchChanges();
    this.getPage(this.page, this.search);
  }

  ngOnDestroy() {
    this.searchSubscription.unsubscribe();
  }

  /**
   * Search projects using a set of filters
   *
   * @param page Pagination parameters
   * @param filters Filters to apply in the search
   */
   public getPage(page: Page, search: Search): void {
    this.isLoading = true;
    if (!this.loggedUserService.getLoggerUser()) {
      this.search.filters.privacyNames = ['public'];
    }
    this.searchService.executeSearch(search, page).subscribe(data => {
      this.updateErrorMessage('');
      this.isLoading = false;
      this.processResponseData(data);
    }, error => {
      this.updateErrorMessage(error);
      this.isLoading = false;
    });
  }

  buildSearchResultComments(searchResult: SearchResult): void {
    const result = [];
    result.push(searchResult.comment);
    if (!searchResult.project) {
      result.push('No projects found');
    }
    searchResult.searchResultComments = result;
  }

  public getTargetText(projectIntention: ProjectIntention): string {
    let text = '';
    const intentionByGene = projectIntention.intentionByGene;
    if (intentionByGene && intentionByGene.gene) {
      text = intentionByGene.gene.symbol;
      return text;
    }
  }

  public onPaginatorChanged(paginator: MatPaginator) {
    // eslint-disable-next-line id-blacklist
    this.page.number = paginator.pageIndex;
    this.page.size = paginator.pageSize;
    this.getPage(this.page, this.search);
  }

  private resetPage() {
    // eslint-disable-next-line id-blacklist
    this.page.number = 0;
    this.paginator.pageIndex = 0;
  }

  private subscribeToSearchChanges() {
    this.searchSubscription = this.searchService.searchChange.subscribe((search: Search) => {
      this.resetPage();
      this.getPage(this.page, search);
    });
  }

  private processResponseData(data: SearchResult[]) {
    this.dataSource = data['results'];
    this.dataSource.map(x => this.buildSearchResultComments(x));
    this.refreshVisibleColumns();
    this.page = data['page'];
  }

  private refreshVisibleColumns(): void {
    if (this.searchHasValue()) {
      this.displayedColumns = [
        'Search term',
        'Search Result Comments',
        'Project summary',
        'Gene Symbol / Location',
        'MGI',
        'Intention',
        'Best Human ortholog',
        'Work Unit(s)',
        'Work Group(s)',
        'Project Assignment',
        'Summary Status',
        'Colony Name(s)',
        'Phenotyping External Reference(s)',
        'Privacy',
        'Consortia',
        'Access Restriction'];

    } else {
      this.displayedColumns = [
        'Project summary',
        'Gene Symbol / Location',
        'MGI',
        'Intention',
        'Best Human ortholog',
        'Work Unit(s)',
        'Work Group(s)',
        'Project Assignment',
        'Summary Status',
        'Colony Name(s)',
        'Phenotyping External Reference(s)',
        'Privacy',
        'Consortia',
        'Access Restriction'];
    }
  }

  private searchHasValue() {
    return this.search.searchInput.value;
  }

  private updateErrorMessage(error) {
    this.errorMessageChanged.emit(error);
  }

}
