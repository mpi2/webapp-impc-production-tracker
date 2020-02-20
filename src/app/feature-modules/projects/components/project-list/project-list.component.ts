import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ConfigurationData, ConfigurationDataService, LoggedUserService } from 'src/app/core';
import { FilterDefinition } from 'src/app/feature-modules/filters/model/filter-definition';
import { Observable } from 'rxjs';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map, share, startWith } from 'rxjs/operators';
import { FilterType } from 'src/app/feature-modules/filters/model/filter-type';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterContainerComponent } from 'src/app/feature-modules/filters/components/filter-container/filter-container.component';
import { FilterService } from 'src/app/feature-modules/filters/services/filter.service';
import { ProjectService } from '../..';
import { ProjectFilter } from '../../model/project-filter';
import { User } from 'src/app/core/model/user/user';
import { NamedValue } from 'src/app/core/model/common/named-value';


@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit, OnDestroy {
  @ViewChild(FilterContainerComponent) filter: FilterContainerComponent;

  filtersDefinition: FilterDefinition[];
  filtersInitialValues: ProjectFilter;
  filterVisible = false;
  downloading = false;
  isLoading = true;

  privacies: NamedValue[];
  intentions: NamedValue[];
  assignmentStatuses: NamedValue[];
  configurationLoaded = false;

  currentFilters: any = {};

  configurationData: ConfigurationData;
  filterChangesSubscription;
  filterCompleteSubscription;
  filtersLoaded = false;

  error;
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      share(),
      startWith(false)
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private filterService: FilterService,
    private projectService: ProjectService,
    private loggedUserService: LoggedUserService,
    private configurationDataService: ConfigurationDataService) { }

  ngOnInit() {
    this.subscribeToFilterChanges();
    this.subscribeToFilterFinished();
    this.isLoading = true;
    this.loadConfigurationData();
  }

  ngOnDestroy() {
    this.filterChangesSubscription.unsubscribe();
    this.filterChangesSubscription.unsubscribe();
  }

  private subscribeToFilterChanges() {
    this.filterChangesSubscription =
      this.filterService.filterChange.subscribe(filters => {
        this.onFiltersChanged(filters);
      });
  }

  private subscribeToFilterFinished() {
    this.filterChangesSubscription =
      this.filterService.filterLoaded.subscribe(loaded => {
        this.filtersLoaded = loaded;
        this.onFiltersChanged(this.currentFilters);
      });
  }

  private initFilters() {
    this.loggedUserService.getLoggerUser().subscribe(user => {
      this.filtersLoaded = false;
      const workUnitsByUser = this.getWorkUnitsByNotAdminUser(user);
      const filtersByUrl = this.getFiltersByUrl();
      this.filtersInitialValues = this.buildInitialFilterValues(workUnitsByUser, filtersByUrl);
      this.filtersDefinition = this.buildFilterDefinition(workUnitsByUser);
    });
  }

  private getWorkUnitsByNotAdminUser(user: User): string[] {
    let workUnits = null;
    if (!user.isAdmin) {
      workUnits = user.rolesWorkUnits.map(x => x.workUnitName);
    }
    return workUnits;
  }

  private getFiltersByUrl() {
    return { ...this.activatedRoute.snapshot.queryParams };
  }

  private buildInitialFilterValues(workUnitsByUser: string[], filtersByUrl: ProjectFilter): ProjectFilter {
    let initialFilterValues: ProjectFilter = new ProjectFilter();
    initialFilterValues = filtersByUrl;
    if (workUnitsByUser) {
      initialFilterValues.workUnitNames = workUnitsByUser;
    }
    return initialFilterValues;
  }

  toogleShowFilters() {
    this.filterVisible = !this.filterVisible;
  }

  onFiltersChanged(e) {
    const validatedFilters = this.filterService.buildValidFilter(e);
    this.currentFilters = validatedFilters;
    this.updateUrlWithFilters(validatedFilters);
    if (this.filtersLoaded) {
      this.projectService.emitFilterChange(e);
    }
  }

  private updateUrlWithFilters(filters) {
    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: filters,
        replaceUrl: true
      }
    );
  }

  private loadConfigurationData() {
    this.configurationDataService.getConfigurationData().subscribe(data => {
      this.configurationData = data;
      this.initFilters();
      this.configurationLoaded = true;
    });
  }

  buildFilterDefinition(workUnitsFilteredData: string[]) {
    const workUnitNames: NamedValue[] =
      workUnitsFilteredData ?
        workUnitsFilteredData.map(x => ({ name: x })) :
        this.configurationData.workUnits.map(x => ({ name: x }));
    const workGroupNames: NamedValue[] = this.configurationData.workGroups.map(x => ({ name: x }));
    const privaciesNames: NamedValue[] = this.configurationData.privacies.map(x => ({ name: x }));
    const consortiaNames: NamedValue[] = this.configurationData.consortia.map(x => ({ name: x }));
    const intentionNames: NamedValue[] = this.configurationData.molecularMutationTypes.map(x => ({ name: x }));
    return [
      {
        title: 'Marker Symbol/ MGI',
        name: 'genes',
        type: FilterType.Text
      },
      {
        title: 'TPN',
        name: 'tpns',
        type: FilterType.Text
      },
      {
        title: 'External Reference',
        name: 'externalReferences',
        type: FilterType.Text
      },
      {
        title: 'Intention',
        name: 'intentions',
        type: FilterType.Checkboxes,
        dataSource: intentionNames
      },
      {
        title: 'Work Units',
        name: 'workUnitNames',
        type: FilterType.Checkboxes,
        dataSource: workUnitNames
      },
      {
        title: 'Work Groups',
        name: 'workGroupNames',
        type: FilterType.Checkboxes,
        dataSource: workGroupNames
      },
      {
        title: 'Consortia',
        name: 'consortiaNames',
        type: FilterType.Checkboxes,
        dataSource: consortiaNames
      },
      {
        title: 'Privacies',
        name: 'privacyNames',
        type: FilterType.Checkboxes,
        dataSource: privaciesNames
      }
    ];
  }

  downloadCsv() {
    console.log('this.currentFilters', this.currentFilters);

    this.downloading = true;
    this.projectService.exportCsv(this.currentFilters).subscribe(data => {
      this.download('projectResults.csv', data);
      this.downloading = false;
      this.error = '';
    },
      error => {
        this.error = error;
        this.downloading = false;
      }
    );
  }

  download(filename, text) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  onErrorLoadingContent(e) {
    this.error = e;
  }

}
