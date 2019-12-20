import { Component, OnInit } from '@angular/core';
import { ConfigurationData, ConfigurationDataService } from 'src/app/core';
import { ProjectFilterService as projectFilterService } from '../../services/project-filter.service';
import { Filter } from 'src/app/core/model/common/filter';
import { ArrayFilter } from 'src/app/core/model/common/array-filter';
import { User } from 'src/app/core/model/user/user';
import { FilterDefinition } from 'src/app/feature-modules/filters/model/filter-definition';
import { Observable } from 'rxjs';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map, share, startWith } from 'rxjs/operators';
import { FilterType } from 'src/app/feature-modules/filters/model/filter-type';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {
  filtersDefinition: FilterDefinition[];
  filterVisible = false;
  downloading = false;
  isLoading = true;

  privacies: NamedValue[];
  intentions: NamedValue[];
  assignmentStatuses: NamedValue[];

  tpnFilterInput: string;
  externalReferenceFilterInput: string;
  markerSymbolFilterInput: string;
  intentionsFilterInput: string;
  assignmentStatusesFilterInput: string;

  tpnFilterObject: Filter = new Filter();
  markerSymbolFilterObject: Filter = new Filter();
  intentionsFilterObject: ArrayFilter = new ArrayFilter();
  privaciesFilterObject: ArrayFilter = new ArrayFilter();
  assignmentStatusesFilterObject: ArrayFilter = new ArrayFilter();

  configurationData: ConfigurationData;

  error;
  loggedUser: User = new User();

  projectFilterService: projectFilterService = new projectFilterService();

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      share(),
      startWith(false)
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private configurationDataService: ConfigurationDataService) { }

  ngOnInit() {
    this.isLoading = true;
    this.loadConfigurationData();
  }

  toogleShowFilters() {
    this.filterVisible = !this.filterVisible;
  }

  private loadConfigurationData() {
    this.configurationDataService.getConfigurationData().subscribe(data => {
      this.configurationData = data;
      this.setupFilters();
    });
  }

  setupFilters() {
    const workUnitNames: NamedValue[] = this.configurationData.workUnits.map(x => ({ name: x }));
    this.filtersDefinition = [
      {
        title: 'TPN',
        name: 'tpn',
        type: FilterType.Text
      },
      {
        title: 'External Reference',
        name: 'texternalReference',
        type: FilterType.Text
      },
      {
        title: 'Gene',
        name: 'gene',
        type: FilterType.Text
      },
      {
        title: 'Intention',
        name: 'intention',
        type: FilterType.Checkboxes
      },
      {
        title: 'Work Units',
        name: 'workUnitName',
        type: FilterType.Checkboxes,
        dataSource: workUnitNames
      }
    ];
  }

  downloadCsv() {
    console.log('Still to be implemented');

  }

  onErrorLoadingContent(e) {
    this.error = e;
  }

}
