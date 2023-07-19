import { Component, OnInit, ViewChild, Output, EventEmitter, OnDestroy, Input } from '@angular/core';
import { Project } from 'src/app/model';
import { Page } from 'src/app/model/page_structure/page';
import { ConfigurationData } from 'src/app/core';
import { ProjectFilter, ProjectService } from '../..';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { Sort } from 'src/app/model/page_structure/sort';

@Component({
  selector: 'app-project-list-content',
  templateUrl: './project-list-content.component.html',
  styleUrls: ['./project-list-content.component.css']
})
export class ProjectListContentComponent implements OnInit, OnDestroy {

  @Input() filters: ProjectFilter;
  @Output() errorRaised = new EventEmitter<string>();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  dataSource: Project[] = [];
  sort: Sort = { property: 'tpn', direction: 'ASC'};
  // eslint-disable-next-line id-blacklist
  page: Page = { number: 0, size: 20, sorts: [this.sort] };
  isLoading = true;
  configurationData: ConfigurationData;

  filterChangesSubscription;

  constructor(private projectService: ProjectService) { }

  ngOnInit() {
    this.subscribeToFilterChanges();
  }



  ngOnDestroy() {
    this.filterChangesSubscription.unsubscribe();
  }

  public getPage(page: Page, filters): void {
    this.isLoading = true;
    this.projectService.getProjects(filters, page).subscribe(data => {
      this.processResponseData(data);
      this.isLoading = false;

    }, error => {
      this.errorRaised.emit(error);
      this.isLoading = false;
    });
  }

  public onPaginatorChanged(paginator: MatPaginator) {
    // eslint-disable-next-line id-blacklist
    this.page.number = paginator.pageIndex;
    this.page.size = paginator.pageSize;
    this.getPage(this.page, this.filters);
  }

  private resetPage() {
    // eslint-disable-next-line id-blacklist
    this.page.number = 0;
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
  }

  private processResponseData(data: Project[]) {
    /* eslint-disable @typescript-eslint/dot-notation */
    if (data['_embedded']) {
      this.dataSource = data['_embedded']['projects'];
      this.page = data['page'];
    } else {
      this.dataSource = [];
    }
    /* eslint-enable @typescript-eslint/dot-notation */
  }

  private subscribeToFilterChanges() {
    this.filterChangesSubscription = this.projectService.filterChange.subscribe(filter => {
      this.filters = filter;
      this.resetPage();
      this.getPage(this.page, this.filters);
    });
  }

}
