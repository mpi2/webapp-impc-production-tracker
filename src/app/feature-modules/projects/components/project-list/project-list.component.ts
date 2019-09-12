import { Component, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';
import { SelectItem } from 'primeng/api';
import { ProjectService } from '../../services/project.service';
import { ProjectSummary, ProjectSummaryAdapter } from '../../model/project-summary';
import { ConfigurationData, ConfigurationDataService, LoggedUserService } from 'src/app/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatPaginator, MatSort } from '@angular/material';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  isLoading = true;
  displayedColumns: string[] = ['Project', 'ExternalReference', 'Marker Symbol(s)', 'Intention','Project Assignment','Privacy', 'Is active', 'Consortium'];
  projects: ProjectSummary[] = [];
  user_name: any;
  p = 0;
  page: any = {};
  planTypes: SelectItem[];
  workUnits: SelectItem[];
  workGroups: SelectItem[];
  statuses: SelectItem[];
  privacies: SelectItem[];

  selectedPlanTypes: [];
  selectedWorkGroups: [];
  selectedWorkUnits: [];
  selectedStatuses: [];
  selectedPrivacies: [];

  workUnitFilterValues: string[] = [];
  workGroupFilterValues: string[] = [];
  planTypeFilterValues: string[] = [];
  statusFilterValues: string[] = [];
  privaciesFilterValues: string[] = [];

  configurationData: ConfigurationData;

  error;


  constructor(
    private projectService: ProjectService,
    private adapter: ProjectSummaryAdapter,
    private loggedUserService: LoggedUserService,
    private configurationDataService: ConfigurationDataService) { }

  ngOnInit() {
    this.configurationData = this.configurationDataService.getConfigurationInfo();
    if (this.configurationData) {
      this.planTypes = this.configurationData.planTypes.map(p => { return { label: p, value: p } });
      this.workGroups = this.configurationData.workGroups.map(p => { return { label: p, value: p } });
      this.workUnits = this.configurationData.workUnits.map(p => { return { label: p, value: p } });
      this.privacies = this.configurationData.privacies.map(p => { return { label: p, value: p } });
      this.statuses = this.configurationData.statuses.map(p => { return { label: p, value: p } });
      console.log('planTypes', this.planTypes);

    }
    this.isLoading = true;
    this.getPage(0);
  }

  getPage(pageNumber: number) {
    console.log('Get Page Projects');
    
    this.isLoading = true;
    // The end point starts page in number 0, while the component starts with 1.
    const apiPageNumber = pageNumber;
    const workUnitNameFilter = this.getWorkUnitNameFilter();
    this.projectService.getPaginatedProjectsWithFilters(
      apiPageNumber,
      [],
      workUnitNameFilter,
      this.getWorkGroupFilter(),
      this.getPlanTypeFilter(),
      this.getStatusFilter(),
      this.getPrivacyFilter()).pipe(first()).subscribe(data => {
        console.log('Projects data ',data);
        
        if (data['_embedded']) {
          this.projects = data['_embedded']['projectDToes'];
          console.log('--->this.projects ',this.projects );
          
          this.projects = this.projects.map(x => this.adapter.adapt(x));
        } else {
          this.projects = [];
        }
        console.log('this.projects', this.projects);
        
        this.page = data['page'];
        this.p = pageNumber;
        this.isLoading = false;
      },
        error => {
          this.isLoading = false;
          console.log('An error', error);

          this.error = error;
        }
      );
  }

  getWorkUnitNameFilter() {
    const loggedUser = this.loggedUserService.getLoggerUser();
    let workUnitFilter = [];
    if (loggedUser) {
      if ('admin' != loggedUser.role) {
        if (loggedUser.workUnitName) {
          workUnitFilter.push(loggedUser.workUnitName);
        } else {
          console.error('The logged user does not have a defined workUnit.');
          workUnitFilter.push('---');
        }
      }
    } else {
      console.error('User must be logged into the application');
      workUnitFilter.push('---');
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
      case 'privacy':
        this.privaciesFilterValues = e;
        break;
      default:
        console.error('invalid option', column);
    }
    this.isLoading = true;
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

  getPrivacyFilter(): string[] {
    if (this.privaciesFilterValues.length === this.privacies.length) {
      return [];
    } else {
      return this.privaciesFilterValues;
    }
  }

}
