import { Component, OnInit, Input, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { SearchResult } from '../../model/search.result';
import { ProjectIntention } from 'src/app/model';
import { Page } from 'src/app/model/page_structure/page';
import { SearchFilter } from '../../model/search-filter';
import { Search, SearchService } from '../..';
import { LoggedUserService } from 'src/app/core';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search-content',
  templateUrl: './search-content.component.html',
  styleUrls: ['./search-content.component.css']
})
export class SearchContentComponent implements OnInit, OnDestroy {

  @Input() search: Search;
  @Output() errorMessageChanged = new EventEmitter<string>();

  dataSource: SearchResult[];
  page: Page = { number: 0, size: 20 };
  isLoading = true;
  displayedColumns: string[] = [];
  searchSubscription: Subscription;

  @ViewChild(MatPaginator) paginator: MatPaginator;

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

  private resetPage() {
    this.page.number = 0;
    this.paginator.pageIndex = 0;
  }

  private subscribeToSearchChanges() {
    this.searchSubscription = this.searchService.searchChange.subscribe((search: Search) => {
      this.resetPage();
      this.getPage(this.page, search);
    });
  }

  /**
   * Search projects using a set of filters
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

  private processResponseData(data: SearchResult[]) {
    /* tslint:disable:no-string-literal */
    this.dataSource = data['results'];
    this.dataSource.map(x => this.buildSearchResultComments(x));
    /// this.updateInputIfSearchedByFile();
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

  public getTargetText(projectIntention: ProjectIntention): string {
    let text = '';
    const intentionByGene = projectIntention.intentionByGene;
    if (intentionByGene && intentionByGene.gene) {
      text = intentionByGene.gene.symbol;
      return text;
    }
  }

  public onPaginatorChanged(paginator: MatPaginator) {
    this.page.number = paginator.pageIndex;
    this.page.size = paginator.pageSize;
    this.getPage(this.page, this.search);
  }

}
