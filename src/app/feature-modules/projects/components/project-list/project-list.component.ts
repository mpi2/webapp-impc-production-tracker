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
import { ProjectService } from '../..';

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

  currentFilters: any = {};

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
    private projectService: ProjectService,
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
    this.currentFilters = validatedFilters;
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
    const workGroupNames: NamedValue[] = this.configurationData.workGroups.map(x => ({ name: x }));
    const privaciesNames: NamedValue[] = this.configurationData.privacies.map(x => ({ name: x }));
    const consortiaNames: NamedValue[] = this.configurationData.consortia.map(x => ({ name: x }));
    const intentionNames: NamedValue[] = this.configurationData.alleleTypes.map(x => ({ name: x }));
    this.filtersDefinition = [
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

  setInitialValuesForFilters() {
    const currentParameters = this.activatedRoute.snapshot.queryParams;
    this.filtersInitialValues = currentParameters;
    this.currentFilters = currentParameters;

  }

  downloadCsv() {
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
