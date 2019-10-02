import { Component, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';
import { SelectItem } from 'primeng/api';
import { ProjectService } from '../../services/project.service';
import { ProjectSummary, ProjectSummaryAdapter } from '../../model/project-summary';
import { ConfigurationData, ConfigurationDataService, LoggedUserService, LoggedUser } from 'src/app/core';
import { MatPaginator, MatSort } from '@angular/material';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  isLoading = true;
  intentionsForm = new FormControl();
  assignmentStatusesForm = new FormControl();
  privaciesForm = new FormControl();
  projects: ProjectSummary[] = [];
  p = 0;
  page: any = {};
  planTypes: SelectItem[];
  workUnits: SelectItem[];
  workGroups: SelectItem[];
  statuses: SelectItem[];
  
  privacies: NamedValue[];
  intentions: NamedValue[];
  assignmentStatuses: NamedValue[];

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

  
  tpnFilterInput: string;
  tpnFilter: string = '';
  externalReferenceFilterInput: string;
  externalReferenceFilter: string = '';
  markerSymbolFilterInput: string;
  markerSymbolFilter: string = '';
  intentionFilterInput: string;
  intentionFilter: string;

  configurationData: ConfigurationData;

  error;
  loggedUser: LoggedUser = new LoggedUser();

  constructor(
    private projectService: ProjectService,
    private adapter: ProjectSummaryAdapter,
    private loggedUserService: LoggedUserService,
    private configurationDataService: ConfigurationDataService) { }

  ngOnInit() {
    this.isLoading = true;
    this.configurationDataService.getConfigurationData().subscribe(data => {
      this.configurationData = data;
      this.initFiltersValues();
      if (this.loggedUserService.getLoggerUser()) {
        this.loggedUserService.getLoggerUser().subscribe(data => {
          this.loggedUser = data;
          this.getPage(0);
        });
      } else {
        this.loggedUser = new LoggedUser();
        this.loggedUser.userName = 'anonymous';
        this.getPage(0);
      }

    }, error => {
      console.log('error:', error);
      this.error = error;
      this.isLoading = false;
    });
  }

  private initFiltersValues(): void {
    this.planTypes = this.configurationData.planTypes.map(p => { return { label: p, value: p } });
    this.workGroups = this.configurationData.workGroups.map(p => { return { label: p, value: p } });
    this.workUnits = this.configurationData.workUnits.map(p => { return { label: p, value: p } });
    this.statuses = this.configurationData.statuses.map(p => { return { label: p, value: p } });

    this.intentions = this.configurationData.alleleTypes.map(p => { return {name: p }});
    this.assignmentStatuses = this.configurationData.assignmentStatuses.map(p => { return {name: p }});
    this.privacies = this.configurationData.privacies.map(p => { return {name: p }});
  }

  getPage(pageNumber: number) {
    this.isLoading = true;
    const apiPageNumber = pageNumber;
    const workUnitNameFilter = this.getWorkUnitNameFilter();
    this.projectService.getPaginatedProjectsWithFilters(
      apiPageNumber,
      this.tpnFilter,
      this.getMarkerSymbolFilter(),
      workUnitNameFilter,
      this.getWorkGroupFilter(),
      this.getPlanTypeFilter(),
      this.getStatusFilter(),
      this.getPrivacyFilter()).pipe(first()).subscribe(data => {
        if (data['_embedded']) {
          this.projects = data['_embedded']['projectDToes'];
          this.projects = this.projects.map(x => this.adapter.adapt(x));
        } else {
          this.projects = [];
        }
        this.page = data['page'];
        this.p = pageNumber;
        this.isLoading = false;
        this.error = null;
      },
        error => {
          this.isLoading = false;
          this.error = error;
        }
      );
  }

  getWorkUnitNameFilter(): string[] {
    const workUnitFilter = this.getWorkUnitsForLoggedUser();
    return workUnitFilter;
  }

  private getWorkUnitsForLoggedUser(): string[] {
    const workUnitNames = [];
    if (this.loggedUser.rolesWorkUnits) {
      this.loggedUser.rolesWorkUnits.map(x => workUnitNames.push(x.workUnitName));
    }
    return workUnitNames;
  }

  filter(e, column) {
    switch (column) {
      case 'tpn':
        if (this.isValidTpn(e)) {
          this.tpnFilter = e;
        } else {
          return;
        }
        break;
        case 'markerSymbol':
        if (this.isValidMarkerSymbol(e)) {
          this.markerSymbolFilter = e;
        } else {
          return;
        }
        break;
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
    console.log(this.page);
    
    this.getPage(0);
  }

  isValidTpn(value: string): boolean {
    console.log(value);
    
    const MINIMUN_SIZE = 7;
    let result = false;
    if (value) {
      result = value.toLocaleLowerCase().startsWith("tpn:") && value.length > MINIMUN_SIZE && value != this.tpnFilter;
    }
    return result;
  }

  isValidMarkerSymbol(value: string): boolean {
    console.log(value,'this.markerSymbolFilter',this.markerSymbolFilter);
    
    const MINIMUN_SIZE = 3;
    let result = false;
    if (value) {
      result = value.length > MINIMUN_SIZE && value.trim() != this.markerSymbolFilter.trim();
    }
    return result;
  }

  getMarkerSymbolFilter(): string[] {
    let result = [];
    if (this.markerSymbolFilter) {
      result = [this.markerSymbolFilter.trim()]
    }
    return result;
  }

  getWorkUnitFilter(): string[] {
    if (this.workUnitFilterValues.length === this.workUnits.length) {
      return [];
    } else {
      return this.workUnitFilterValues;
    }
  }

  getWorkGroupFilter(): string[] {
    if (!this.workGroups || this.workGroupFilterValues.length === this.workGroups.length) {
      return [];
    } else {
      return this.workGroupFilterValues;
    }
  }

  getPlanTypeFilter(): string[] {
    if (!this.planTypes || this.planTypeFilterValues.length === this.planTypes.length) {
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
