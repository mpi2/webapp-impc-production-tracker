import { Component, OnInit } from '@angular/core';
import { ProjectSummary, ProjectSummaryAdapter } from 'src/app/_models/project/projectSummary';
import { ProjectService } from 'src/app/_services';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-plan',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  projects: ProjectSummary[] = [];
  username: any;
  p = 1;
  page: any = {};
  loading = false;

  constructor(private projectService: ProjectService, private adapter: ProjectSummaryAdapter) { }

  ngOnInit() {
    this.getPage(1);
  }

  getPage(pageNumber: number) {
      this.loading = true;
      // The end point starts page in number 0, while the component starts with 1.
      const apiPageNumber = pageNumber - 1;
      this.projectService.getPaginatedProjectSummaries(apiPageNumber).pipe(first()).subscribe(data => {
          this.projects = data['_embedded']['projectSummaryDToes'];
          this.projects = this.projects.map(x => this.adapter.adapt(x));
          this.page = data['page'];
          this.p = pageNumber;
          console.log('Projects in ProjectsComponent: ', this.projects);
          console.log('Pagination info:', this.page);
      });
  }
}
