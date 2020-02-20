import { Component, OnInit, ViewChild, Output, EventEmitter, OnDestroy, Input } from '@angular/core';
import { Project } from 'src/app/model';
import { Page } from 'src/app/model/page_structure/page';
import { ConfigurationData } from 'src/app/core';
import { ProjectFilter, ProjectService } from '../..';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-project-list-content',
  templateUrl: './project-list-content.component.html',
  styleUrls: ['./project-list-content.component.css']
})
export class ProjectListContentComponent implements OnInit, OnDestroy {

  dataSource: Project[] = [];
  @Input() filters: ProjectFilter;

  @Output() errorRaised = new EventEmitter<string>();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  page: Page = { number: 0, size: 20 };
  isLoading = true;
  configurationData: ConfigurationData;

  filterChangesSubscription;

  constructor(private projectService: ProjectService) { }

  ngOnInit() {
    this.subscribeToFilterChanges();
  }

  private subscribeToFilterChanges() {
    this.filterChangesSubscription = this.projectService.filterChange.subscribe(filter => {
      this.filters = filter;
      this.resetPage();
      this.getPage(this.page, this.filters);
    });
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

  private resetPage() {
    this.page.number = 0;
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
  }

  private processResponseData(data: Project[]) {
    /* tslint:disable:no-string-literal */
    if (data['_embedded']) {
      this.dataSource = data['_embedded']['projects'];
      this.page = data['page'];
    } else {
      this.dataSource = [];
    }
    /* tslint:enable:no-string-literal */
  }

  public onPaginatorChanged(paginator: MatPaginator) {
    this.page.number = paginator.pageIndex;
    this.page.size = paginator.pageSize;
    this.getPage(this.page, this.filters);
  }

}
