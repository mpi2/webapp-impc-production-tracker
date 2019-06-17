import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { first } from 'rxjs/operators';

import { ProjectService, WorkUnitService, WorkGroupService } from '../_services';
import { WorkUnit, WorkGroup, WorkUnitAdapter, WorkGroupAdapter } from '../_models';
import { ProjectSummary, ProjectSummaryAdapter } from '../_models/project/projectSummary';

@Component({
  selector: 'app-gene-search',
  templateUrl: './gene-search.component.html',
  styleUrls: ['./gene-search.component.css']
})
export class GeneSearchComponent implements OnInit {
  geneSearchForm: FormGroup;
  projects: ProjectSummary[] = [];
  p = 1;
  page: any = {};
  workUnits: WorkUnit[] = [];
  workGroups: WorkGroup[] = [];
  masterSelected: boolean;
  checkedList: any;
  myTextarea: string;

  constructor(
    private formBuilder: FormBuilder,
    private projectService: ProjectService,
    private workUnitService: WorkUnitService,
    private workGroupService: WorkGroupService,
    private projectAdapter: ProjectSummaryAdapter,
    private workUnitAdapter: WorkUnitAdapter,
    private workGroupAdapter: WorkGroupAdapter
  ) { }

  ngOnInit() {
    this.geneSearchForm = this.formBuilder.group({
      geneSymbol: ['']
    });
    
    this.workUnitService.getAll().pipe(first()).subscribe(workUnits => {
      this.workUnits = workUnits['_embedded']['workUnits'];
      this.workUnits = this.workUnits.map(x => {
        x = this.workUnitAdapter.adapt(x);
        x["isSelected"] = true;
        return x;
      });
    });

    this.workGroupService.getAll().pipe(first()).subscribe(workGroups => {
      this.workGroups = workGroups['_embedded']['workGroups'];
      this.workGroups = this.workGroups.map(x => {
        x = this.workGroupAdapter.adapt(x);
        x["isSelected"] = true;
        return x;
      });
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

    if (!workUnitSelectAll.checked){
      selectedWorkUnits = this.workUnits.filter(x => x["isSelected"]).map(element => element.name);
    }
    if (!workGroupSelectAll.checked){
      selectedWorkGroups = this.workGroups.filter(x => x["isSelected"]).map(element => element.name);
    }
  
    const geneSymbols = this.getGeneSymbolsAsArray();

    this.projectService.getPaginatedProjectSummariesWithFilters(
      apiPageNumber,
      geneSymbols,
      selectedWorkUnits,
      selectedWorkGroups,
      [],
      [],
      [],
      [],).pipe(first()).subscribe(data => {
      if (data['_embedded']){
        this.projects = data['_embedded']['projectSummaryDToes'];
        this.projects = this.projects.map(x => this.projectAdapter.adapt(x));
      } else {
        this.projects = [];
      }
      this.page = data['page'];
      this.p = page;
    });
  }

  getGeneSymbolsAsArray() {
    if (this.geneSearchForm.get('geneSymbol').value){
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
