import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { Project } from 'src/app/model';
import { Page } from 'src/app/model/page_structure/page';
import { ConfigurationData } from 'src/app/core';
import { ProjectFilter, ProjectService } from '../..';
import { MatPaginator } from '@angular/material';

@Component({
  selector: 'app-project-list-content',
  templateUrl: './project-list-content.component.html',
  styleUrls: ['./project-list-content.component.css']
})
export class ProjectListContentComponent implements OnInit {

  dataSource: Project[] = [];
  @Input() filters: ProjectFilter;

  @Output() errorRaised = new EventEmitter<string>();

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  page: Page = { number: 0, size: 20 };
  isLoading = true;
  configurationData: ConfigurationData;

  constructor(private projectService: ProjectService) { }

  ngOnInit() {
    this.getPage(this.page, this.filters);
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
