import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl} from '@angular/forms';

import { first } from 'rxjs/operators';

import { ProjectSummary, ProjectSummaryAdapter } from '../../projects/model/project-summary';
import { ProjectService } from '../../projects/services/project.service';
import { WorkUnit, WorkGroup, ConfigurationData, ConfigurationDataService } from 'src/app/core';

@Component({
  selector: 'app-gene-search',
  templateUrl: './gene-search.component.html',
  styleUrls: ['./gene-search.component.css']
})
export class GeneSearchComponent implements OnInit {
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
