import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfigurationData, ConfigurationDataService } from 'src/app/core';
import { FilterDefinition } from 'src/app/feature-modules/filters/model/filter-definition';
import { Observable } from 'rxjs';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map, share, startWith } from 'rxjs/operators';
import { FilterType } from 'src/app/feature-modules/filters/model/filter-type';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterContainerComponent } from 'src/app/feature-modules/filters/components/filter-container/filter-container.component';
import { FilterService } from 'src/app/feature-modules/filters/services/filter.service';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {
  @ViewChild(FilterContainerComponent, { static: false }) filter: FilterContainerComponent;

  filtersDefinition: FilterDefinition[];
  filtersInitialValues: any;
  filterVisible = false;
  downloading = false;
  isLoading = true;

  privacies: NamedValue[];
  intentions: NamedValue[];
  assignmentStatuses: NamedValue[];
  configurationLoaded = false;

  configurationData: ConfigurationData;

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
    private configurationDataService: ConfigurationDataService) { }

  ngOnInit() {
    this.isLoading = true;
    this.loadConfigurationData();
  }

  toogleShowFilters() {
    this.filterVisible = !this.filterVisible;
  }

  onFiltersChanged(e) {
    const validatedFilters = this.filterService.buildValidFilter(e);
    const newQueryParams = validatedFilters;
    this.updateUrlWithFilters(newQueryParams);
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
      this.setupFilters();
      this.setInitialValuesForFilters();
      this.configurationLoaded = true;
    });
  }

  setupFilters() {
    const workUnitNames: NamedValue[] = this.configurationData.workUnits.map(x => ({ name: x }));
    this.filtersDefinition = [
      {
        title: 'Marker Symbol/ MGI',
        name: 'gene',
        type: FilterType.Text
      },
      {
        title: 'TPN',
        name: 'tpn',
        type: FilterType.Text
      },
      {
        title: 'External Reference',
        name: 'externalReference',
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

  setInitialValuesForFilters() {
    const currentParameters = this.activatedRoute.snapshot.queryParams;
    this.filtersInitialValues = currentParameters;
  }

  downloadCsv() {
    console.log('Still to be implemented');
  }

  onErrorLoadingContent(e) {
    this.error = e;
  }

}
