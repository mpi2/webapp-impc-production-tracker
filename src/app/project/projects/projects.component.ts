import { Component, OnInit } from '@angular/core';
import { ProjectSummary } from 'src/app/_models/project/projectSummary';
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

  constructor(private projectService: ProjectService) { }

  ngOnInit() {
    this.getPage(1);
  }

  getPage(page: number) {
      this.loading = true;
      // The end point starts page in number 0, while the component starts with 1.
      const apiPageNumber = page - 1;
      this.projectService.getAllProjectSummariesWithPage(apiPageNumber).pipe(first()).subscribe(data => {
          console.log('Raw data from service::', data);
          this.projects = data['_embedded']['projectSummaryDToes'];
          this.page = data['page'];
          this.p = page;
          this.projects.map(x => x.numberOfPlans = this.getNumberOfRows(x));
          console.log('Projects::', this.projects);
          console.log('page::', this.page);
      });
  }

  getNumberOfRows(project) {
    if (project['planDetails'].length > 1) {
      return project['planDetails'].length + 1;
    }
    return project['planDetails'].length + 1;
  }

}
