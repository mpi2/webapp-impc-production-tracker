import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { WorkGroup, AlleleType, Priority, Gene } from '../_models';
import { WorkGroupService, PriorityService, AlleleTypeService, GeneService } from '../_services';
import { Observable } from 'rxjs';
import { first, debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css']
})
export class CreateProjectComponent implements OnInit {
  createProjectForm: FormGroup;

  dropdownSettingsSingle = {};
  dropdownSettingsMultiple = {};

  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';
  workUnit: '';
  workGroups: WorkGroup[] = [];
  priorities: Priority[] = [];
  projectLocation: Gene[] =  [];
  projectIntentions: AlleleType[] = [];
  symbol: string;
  genes: Gene[] = [];
  gene: Gene;
  genesLoading = false;
  specie: string;
  keyword: string;
  isLoading = false;
  placeHolder: string;
  showGeneTable = false;

  constructor(
    private formBuilder: FormBuilder,
    private workGroupService: WorkGroupService,
    private priorityService: PriorityService,
    private alleleTypeService: AlleleTypeService,
    private geneService: GeneService
  ) { }

  ngOnInit() {
    this.specie = 'mouse';
    this.keyword = 'symbol';
    this.placeHolder = 'Search for a gene';

    this.createProjectForm = this.formBuilder.group({
      workGroup: ['', Validators.required],
      priority: ['', Validators.required],
      projectIntention: ['', Validators.required],
    });
    this.workUnit = JSON.parse(sessionStorage.getItem('tokenInfo'))['workUnitName'];
    console.log(this.workUnit);

    this.workGroupService.getByWorkUnit(this.workUnit).pipe(first()).subscribe(data => {
      if (data.length > 0) {
        this.workGroups = data;
        console.log('workGroups: ', this.workGroups);
      } else {
        this.workGroups = [];
        console.log('workGroups: ', this.workGroups);
      }
    });

    this.priorityService.getAll().pipe(first()).subscribe(priorities => {
      this.priorities = priorities['_embedded']['projectPriorities'];
      console.log('priorities: ', this.priorities);
    });

    this.alleleTypeService.getAll().pipe(first()).subscribe(alleleTypes => {
      this.projectIntentions = alleleTypes['_embedded']['alleleTypes'];
      console.log('projectIntentions: ', this.projectIntentions);
    });

    this.dropdownSettingsSingle = {
      singleSelection: true,
      idField: 'name',
      textField: 'name',
      enableCheckAll: false,
      allowSearchFilter: true
    };

    this.dropdownSettingsMultiple = {
      singleSelection: false,
      idField: 'name',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true
    };
  }

  specieCheck(e) {
    this.specie = e.target.value;
    console.log(this.specie);
  }

  selectEvent(item) {
    // do something with selected item
    this.gene = item;
  }

  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
    this.isLoading = true;
    this.symbol = val;
    console.log(this.symbol);
    if (this.symbol.length > 2) {
      this.geneService.findGeneBySymbol(this.symbol, this.specie).pipe(first()).subscribe(genes => {
        console.log('entra al service');
        this.genes = genes;
        console.log(this.genes);
      });
    }
    this.isLoading = false;
  }

  onFocused(e) {
    // do something when input is focused
  }

  addGene(e) {
    this.projectLocation.push(this.gene);
    console.log(this.projectLocation);
    if (this.projectLocation.length > 0) {
      this.showGeneTable = true;
    } else {
      this.showGeneTable = false;
    }
  }

  onSubmit() {
  }

}
