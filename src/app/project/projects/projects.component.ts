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
    const workUnitNameFilter = this.getWorkUnitNameFilter();
    this.projectService.getPaginatedProjectSummariesWithFilters(apiPageNumber, [], workUnitNameFilter, []).pipe(first()).subscribe(data => {
      if (data['_embedded']) {
        this.projects = data['_embedded']['projectSummaryDToes'];
        this.projects = this.projects.map(x => this.adapter.adapt(x));
      } else {
        this.projects = [];
      }
      this.page = data['page'];
      this.p = pageNumber;
    });
  }

  getWorkUnitNameFilter() {
    const tokenInfo = JSON.parse(sessionStorage.getItem('tokenInfo'));
    let workUnitFilter = [];
    if (tokenInfo && tokenInfo.workUnitName) {
      if (!'admin' === tokenInfo.role) {
        workUnitFilter.push(tokenInfo.workUnitName);
      }
    } else {
      console.error('The logged user does not have a defined workUnit in the token...');
      if ('admin' === tokenInfo.role) {
        // TODO: Just a test to see if filter works...
        workUnitFilter.push('JAX');
        console.error('Setting a value because is admin');
      } else {
        workUnitFilter.push('---');
      }
    }

    console.log('workUnitFilter: ', workUnitFilter);

    return workUnitFilter;
  }
}
