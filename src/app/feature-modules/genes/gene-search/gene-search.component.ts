import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl} from '@angular/forms';
// import {MatSidenavModule} from '@angular/material/sidenav';

import { first } from 'rxjs/operators';

import { ProjectSummary, ProjectSummaryAdapter } from '../../projects/model/project-summary';
import { ProjectService } from '../../projects/services/project.service';
import { WorkUnit, WorkGroup, ConfigurationData, ConfigurationDataService } from 'src/app/core';
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

@Component({
  selector: 'app-gene-search',
  templateUrl: './gene-search.component.html',
  styleUrls: ['./gene-search.component.css']
})
export class GeneSearchComponent implements OnInit {

  displayedColumns: string[] = ['Project summary', 'Allele Intentions', 'Mouse Gene Symbol / Location', 'Human Gene Symbol(s)'];
  // 'Project Assigment', 'Aborted MIs', 'MIs in Progress', 'Genotype Confirmed Mis', 'Breeding Attempts', 'Phenotype Attempts'];
  dataSource = [];
  selectAllWorkUnits = true;
  panelOpenState = false;
  geneSearchForm: FormGroup;
  searchControl = new FormControl();
  projects: ProjectSummary[] = [];
  p = 1;
  page: any = {};
  workUnits: WorkUnit[] = [];
  workGroups: WorkGroup[] = [];
  masterSelected: boolean;
  checkedList: any;
  myTextarea: string;
  configurationData: ConfigurationData;

  error;
  loading = true;

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
    this.getPage(1);
  }

  getPage(page: number) {
    // The end point starts page in number 0, while the component starts with 1.
    const apiPageNumber = page - 1;
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

    this.loading = true;

    this.projectService.getPaginatedProjectSummariesWithFilters(
      apiPageNumber,
      geneSymbols,
      selectedWorkUnits,
      selectedWorkGroups,
      [],
      [],
      []).pipe(first()).subscribe(data => {
        if (data['_embedded']) {
          this.projects = data['_embedded']['projectSummaryDToes'];
          this.projects = this.projects.map(x => this.projectAdapter.adapt(x));
          this.dataSource = this.projects;
        } else {
          this.projects = [];
        }
        this.page = data['page'];
        this.p = page;
        this.loading = false;
      }, error => {
        this.error = error;
        this.loading = false;
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
    this.getPage(1);
  }

  getIdFromWorkUnitName(workUnitName: String) {
    return 'workUnit_' + workUnitName.replace(/\W/g, '_');
  }

  getIdFromWorkGroupName(workGroupName: String) {
    return 'workGroup_' + workGroupName.replace(/\W/g, '_');
  }

}
