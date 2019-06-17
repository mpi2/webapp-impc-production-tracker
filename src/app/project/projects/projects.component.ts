import { Component, OnInit } from '@angular/core';
import { ProjectSummary, ProjectSummaryAdapter } from 'src/app/_models/project/projectSummary';
import { ProjectService } from 'src/app/_services';
import { first } from 'rxjs/operators';
import { SelectItem } from 'primeng/api';
import { Project } from 'src/app/_models';

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
  planTypes: SelectItem[];
  workUnits: SelectItem[];
  workGroups: SelectItem[];
  statuses: SelectItem[];
  priorities: SelectItem[];
  privacies: SelectItem[];

  workUnitFilterValues: string[] = [];
  workGroupFilterValues: string[] = [];
  planTypeFilterValues: string[] = [];
  statusFilterValues: string[] = [];
  prioritiesFilterValues: string[] = [];
  privaciesFilterValues: string[] = [];


  constructor(private projectService: ProjectService, private adapter: ProjectSummaryAdapter) { }

  ngOnInit() {

    const conf = JSON.parse(sessionStorage.getItem('conf'));
    console.log('The conf', conf);
    if (conf) {
      this.planTypes = conf.planTypes.map(p => { return { label: p, value: p } });
      this.workGroups = conf.workGroups.map(p => { return { label: p, value: p } });
      this.workUnits = conf.workUnits.map(p => { return { label: p, value: p } });
      this.privacies = conf.privacies.map(p => { return { label: p, value: p } });
      this.priorities = conf.priorities.map(p => { return { label: p, value: p } });
      this.statuses = conf.statuses.map(p => { return { label: p, value: p } });
    }
    console.log('planTypes', this.planTypes);
    console.log('workGroups', this.workGroups);
    console.log('workUnits', this.workUnits);
    console.log('privacies', this.privacies);
    console.log('priorities', this.priorities);
    console.log('statuses', this.statuses);

    this.getPage(1);
  }

  getPage(pageNumber: number) {
    this.loading = true;
    // The end point starts page in number 0, while the component starts with 1.
    const apiPageNumber = pageNumber - 1;
    const workUnitNameFilter = this.getWorkUnitNameFilter();
    this.projectService.getPaginatedProjectSummariesWithFilters(
      apiPageNumber,
      [],
      workUnitNameFilter,
      this.getWorkGroupFilter(),
      this.getPlanTypeFilter(),
      this.getStatusFilter(),
      this.getPriorityFilter(),
      this.getPrivacyFilter()).pipe(first()).subscribe(data => {
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

  filter(e, column) {
    console.log('Filtering with ', e, 'over', column);
    switch (column) {
      case 'work_unit':
        this.workUnitFilterValues = e;
        break;
      case 'work_group':
        this.workGroupFilterValues = e;
        break;
      case 'plan_type':
        this.planTypeFilterValues = e;
        break;
      case 'status':
        this.statusFilterValues = e;
        break;
      case 'priority':
        this.prioritiesFilterValues = e;
        break;
      case 'privacy':
        this.privaciesFilterValues = e;
        break;
      default:
        console.error('invalid option', column);
    }
    this.getPage(1);
  }

  getWorkUnitFilter(): string[] {
    if (this.workUnitFilterValues.length === this.workUnits.length) {
      return [];
    } else {
      return this.workUnitFilterValues;
    }
  }

  getWorkGroupFilter(): string[] {
    if (this.workGroupFilterValues.length === this.workGroups.length) {
      return [];
    } else {
      return this.workGroupFilterValues;
    }
  }

  getPlanTypeFilter(): string[] {
    if (this.planTypeFilterValues.length === this.planTypes.length) {
      return [];
    } else {
      return this.planTypeFilterValues;
    }
  }

  getStatusFilter(): string[] {
    if (this.statusFilterValues.length === this.statuses.length) {
      return [];
    } else {
      return this.statusFilterValues;
    }
  }

  getPriorityFilter(): string[] {
    if (this.prioritiesFilterValues.length === this.priorities.length) {
      return [];
    } else {
      return this.prioritiesFilterValues;
    }
  }

  getPrivacyFilter(): string[] {
    if (this.privaciesFilterValues.length === this.privacies.length) {
      return [];
    } else {
      return this.privaciesFilterValues;
    }
  }

}
