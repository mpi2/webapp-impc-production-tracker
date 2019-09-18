import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl} from '@angular/forms';
// import {MatSidenavModule} from '@angular/material/sidenav';

import { first } from 'rxjs/operators';

import { ProjectSummary, ProjectSummaryAdapter } from '../../projects/model/project-summary';
import { ProjectService } from '../../projects/services/project.service';
import { WorkUnit, WorkGroup, ConfigurationData, ConfigurationDataService } from 'src/app/core';
import { MatPaginator, MatSort } from '@angular/material';


@Component({
  selector: 'app-gene-search',
  templateUrl: './gene-search.component.html',
  styleUrls: ['./gene-search.component.css']
})
export class GeneSearchComponent implements OnInit {

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  displayedColumns: string[] = ['Project summary', 'Allele Intentions', 'Mouse Gene Symbol / Location', 
'Project Assignment' ];
  selectAllWorkUnits = true;
  panelOpenState = false;
  geneSearchForm: FormGroup;
  searchControl = new FormControl();
  projects: ProjectSummary[] = [];
  p = 0;
  page: any = {};
  workUnits: WorkUnit[] = [];
  workGroups: WorkGroup[] = [];
  masterSelected: boolean;
  checkedList: any;
  myTextarea: string;
  configurationData: ConfigurationData;

  error;
  isLoading = true;
  isRateLimitReached = false;

  constructor(
    private formBuilder: FormBuilder,
    private projectService: ProjectService,
    private configurationDataService: ConfigurationDataService,
    private projectAdapter: ProjectSummaryAdapter) { }


  ngOnInit() {
    this.geneSearchForm = this.formBuilder.group({
      geneSymbol: ['']
    });
    this.configurationData = this.configurationDataService.getConfigurationInfo();

  this.workUnits = this.configurationData.workUnits.map(x => {
    const workUnit: WorkUnit = new WorkUnit();
    workUnit.name = x;
    workUnit["isSelected"] = true;
    return workUnit
  });
  this.workGroups = this.configurationData.workGroups.map(x => {
    const workGroup: WorkGroup = new WorkGroup();
    workGroup.name = x;
    workGroup["isSelected"] = true;
    return workGroup
  });
  
  this.isLoading = true;
  this.getPage(0);
  }

  ngAfterViewInit() {
   // this.exampleDatabase = new ExampleHttpDatabase(this._httpClient);

    // If the user changes the sort order, reset back to the first page.
    //this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

  //   merge(this.sort.sortChange, this.paginator.page)
  //     .pipe(
  //       startWith({}),
  //       switchMap(() => {
  //         this.isLoadingResults = true;
  //         return this.exampleDatabase!.getRepoIssues(
  //           this.sort.active, this.sort.direction, this.paginator.pageIndex);
  //       }),
  //       map(data => {
  //         // Flip flag to show that loading has finished.
  //         this.isLoadingResults = false;
  //         this.isRateLimitReached = false;
  //         this.resultsLength = data.total_count;

  //         return data.items;
  //       }),
  //       catchError(() => {
  //         this.isLoadingResults = false;
  //         // Catch if the GitHub API has reached its rate limit. Return empty data.
  //         this.isRateLimitReached = true;
  //         return observableOf([]);
  //       })
  //     ).subscribe(data => this.data = data);
  // }

 
}

  getPage(page: number) {
    console.log('page number=' + page);
    // The end point starts page in number 0, while the component starts with 1.
    const apiPageNumber = page;
    let workUnitSelectAll = document.querySelector("#workUnitsSelectAll") as HTMLInputElement;
    let workGroupSelectAll = document.querySelector("#workGroupsSelectAll") as HTMLInputElement;
    let selectedWorkUnits = [];
    let selectedWorkGroups = [];

    if (!workUnitSelectAll.checked) {
      selectedWorkUnits = this.workUnits.filter(x => x["isSelected"]).map(element => element.name);
    }
    if (!workGroupSelectAll.checked) {
      selectedWorkGroups = this.workGroups.filter(x => x["isSelected"]).map(element => element.name);
    }

    const geneSymbols = this.getGeneSymbolsAsArray();

    this.isLoading = true;

    this.projectService.getPaginatedProjectsWithFilters(
      apiPageNumber,
      geneSymbols,
      selectedWorkUnits,
      selectedWorkGroups,
      [],
      [],
      []).pipe(first()).subscribe(data => {
        if (data['_embedded']) {
          this.projects = data['_embedded']['projectDToes'];
          this.projects = this.projects.map(x => this.projectAdapter.adapt(x));
        } else {
          this.projects = [];
        }
        this.page = data['page'];
        this.p = page;
        this.isLoading = false;
      }, error => {
        this.error = error;
        this.isLoading = false;
      });
  }

  getGeneSymbolsAsArray() {
    if (this.geneSearchForm.get('geneSymbol').value) {
      const geneSymbols = [];
      geneSymbols.push(this.geneSearchForm.get('geneSymbol').value);
      return geneSymbols;
    }
    return [];
  }

  checkUncheckWorkUnits(e) {
    for (const workUnit of this.workUnits) {
      const selector = '#' + this.getIdFromWorkUnitName(workUnit.name);
      let htmlElement = document.querySelector(selector) as HTMLInputElement;
      htmlElement.checked = e.target.checked;
      workUnit["isSelected"] = e.target.checked;
    }
  }

  checkUncheckWorkGroups(e) {
    for (const workGroup of this.workGroups) {
      const selector = '#' + this.getIdFromWorkGroupName(workGroup.name);
      let htmlElement = document.querySelector(selector) as HTMLInputElement;
      htmlElement.checked = e.target.checked;
      workGroup["isSelected"] = e.target.checked;
    }
  }

  onCheckedWorkUnitElement(element: any) {
    const isSelected = !element["isSelected"]
    element["isSelected"] = isSelected;
    let workUnitSelectAll = document.querySelector("#workUnitsSelectAll") as HTMLInputElement;
    workUnitSelectAll.checked = this.workUnits.filter(x => x["isSelected"]).length === this.workUnits.length;

    return isSelected;
  }

  onCheckedWorkGroupElement(element: any) {
    const isSelected = !element["isSelected"]
    element["isSelected"] = isSelected;
    let workGroupSelectAll = document.querySelector("#workGroupsSelectAll") as HTMLInputElement;
    workGroupSelectAll.checked = this.workGroups.filter(x => x["isSelected"]).length === this.workGroups.length;

    return isSelected;
  }

  onSubmit(e) {
    this.getPage(0);
  }

  getIdFromWorkUnitName(workUnitName: String) {
    return 'workUnit_' + workUnitName.replace(/\W/g, '_');
  }

  getIdFromWorkGroupName(workGroupName: String) {
    return 'workGroup_' + workGroupName.replace(/\W/g, '_');
  }

}
