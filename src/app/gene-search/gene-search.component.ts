import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { first } from 'rxjs/operators';

import { ProjectService, WorkUnitService, WorkGroupService } from '../_services';
import { WorkUnit, WorkGroup } from '../_models';
import { ProjectSummary, ProjectSummaryAdapter } from '../_models/project/projectSummary';

@Component({
  selector: 'app-gene-search',
  templateUrl: './gene-search.component.html',
  styleUrls: ['./gene-search.component.css']
})
export class GeneSearchComponent implements OnInit {
  geneSearchForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';
  projects: ProjectSummary[] = [];
  username: any;
  p = 1;
  page: any = {};
  workUnits: WorkUnit[] = [];
  workGroups: WorkGroup[] = [];
  masterSelected: boolean;
  checkedList: any;

  constructor(
    private formBuilder: FormBuilder,
    private projectService: ProjectService,
    private workUnitService: WorkUnitService,
    private workGroupService: WorkGroupService,
    private adapter: ProjectSummaryAdapter
  ) { }

  ngOnInit() {

    this.geneSearchForm = this.formBuilder.group({
      geneSymbol: ['']
    });
    this.getPage(1);
  }

  getPage(page: number) {
    // this.loading = true;
    // The end point starts page in number 0, while the component starts with 1.
    const apiPageNumber = page - 1;
    this.projectService.getAllProjectSummariesWithPage(apiPageNumber).pipe(first()).subscribe(data => {
        console.log('Raw data from service::', data);
        this.projects = data['_embedded']['projectSummaryDToes'];
        this.page = data['page'];
        this.p = page;
        this.projects = this.projects.map(x => this.adapter.adapt(x));
        console.log('Projects::', this.projects);
        console.log('page::', this.page);
    });

    this.workUnitService.getAll().pipe(first()).subscribe(workUnits => {
      this.workUnits = workUnits['_embedded']['workUnits'];
      for (const workUnit of this.workUnits) {
        workUnit["isSelected"] = true;
      }
      console.log('workUnits: ', this.workUnits);

    });

    this.workGroupService.getAll().pipe(first()).subscribe(workGroups => {
      this.workGroups = workGroups['_embedded']['workGroups'];
      for (const workGroup of this.workGroups) {
        workGroup["isSelected"] = true;
      }
      console.log('workGroups: ', this.workGroups);
    });
  }

  checkUncheckWorkUnits(e) {
    console.log("entra");
    for (const workUnit of this.workUnits) {
      workUnit["isSelected"] = e.target.checked;
    }
    // this.getCheckedItemList();
  }

  checkUncheckWorkGroups(e) {
    console.log("entra");
    for (const workGroup of this.workGroups) {
      workGroup["isSelected"] = e.target.checked;
    }
    // this.getCheckedItemList();
  }

  onSubmit() {
  }

}
