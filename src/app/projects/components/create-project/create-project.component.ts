import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { first } from 'rxjs/operators';

import { LoggedUserService } from '../../../core/services/logged-user.service';
import { LoggedUser } from '../../../core/model/logged-user';
import { ConfigurationDataService } from '../../../core/services/configuration-data.service';
import { ConfigurationData } from '../../../core/model/configuration-data';
import { BasicDataService } from 'src/app/core/services/basic-data.service';
import { WorkGroup, Gene, Funder } from '../../../core/model';
import { NewProject } from '../../model/newProject';
import { ProjectService } from '../../services/project.service';


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
  workGroups: WorkGroup[] = [];
  // priorities: string[] = [];
  projectIntentions: string[] = [];
  projectIntentionsTable: any;
  funders: Funder[] = [];
  backgroundStrains: string[]  = [];
  backgroundStrainsTable: any;
  symbol: string;
  genes: Gene[] = [];
  gene: any;
  genesLoading = false;
  keyword: string;
  isLoading = false;
  placeHolder: string;
  newProject: NewProject;
  loggerUser: LoggedUser;
  configurationData: ConfigurationData;
  isDisabled = true;

  @ViewChild('autocomplete', {static: false}) autocomplete;

  projectGenes: LocalDataSource;
  geneSettings = {
    mode: external,
    hideSubHeader: true,
    columns: {
      symbol: {
        title: 'Gene Symbol',
        editable: false
      },
      mgiId: {
        title: 'MGI id',
        editable: false
      },
      intention: {
        title: 'Intention',
        editable: true,
        editor: {
          type: 'list',
          config: {
            selectText: 'Select',
            list: []
          }
        }
      }
    },
    actions: {
      add: false,
      edit: true,
      delete: true
    },
    // add: {
    //   confirmCreate: true,
    // },
    edit: {
      editButtonContent: '<i class="material-icons inline-block">edit</i>',
      saveButtonContent: '<i class="material-icons inline-block">save</i>',
      cancelButtonContent: '<i class="material-icons inline-block text-danger">cancel</i>',
      editConfirm: true
    },
    delete: {
      deleteButtonContent: '<i class="material-icons text-danger">delete</i>',
      deleteConfirm: true
    },
  };

  projectLocations: LocalDataSource;
  locationSettings = {
    // mode: external,
    hideSubHeader: false,
    columns: {
      index: {
        title: 'Index',
        editable: false,
        filter: false,
        sort: false,
        // sortDirection: 'asc',
        valuePrepareFunction: (row) => {
          // console.log('row => ', row);
          return row;
        }
      },
      chr: {
        title: 'Chr',
        editable: true,
        filter: false,
        sort: false
      },
      start: {
        title: 'Start',
        editable: true,
        filter: false,
        sort: false
      },
      stop: {
        title: 'Stop',
        editable: true,
        filter: false,
        sort: false
      },
      strand: {
        title: 'Strand',
        editable: true,
        filter: false,
        editor: {
          type: 'list',
          config: {
            selectText: 'Select',
            list: [{title: '+', value: 'Positive'}, {title: '-', value: 'Negative'}]
          }
        },
        sort: false
      },
      genomeBuild: {
        title: 'Genome build',
        editable: true,
        filter: false,
        sort: false
      },
      backgroundStrain: {
        title: 'Background strain',
        editable: true,
        filter: false,
        editor: {
          type: 'list',
          config: {
            selectText: 'Select',
            list: []
          }
        },
        sort: false
      },
      intention: {
        title: 'Intention',
        editable: true,
        filter: false,
        editor: {
          type: 'list',
          config: {
            selectText: 'Select',
            list: []
          }
        },
        sort: false
      },
      specie: {
        title: 'Specie',
        editable: true,
        filter: false,
        editor: {
          type: 'list',
          config: {
            selectText: 'Select',
            list: [{title: 'Mouse', value: 'Mouse'}, {title: 'Human', value: 'Human'}]
          }
        },
        sort: false
      },
      sequence: {
        title: 'Sequence',
        editable: true,
        filter: false,
        sort: false
      }
    },
    actions: {
      add: true,
      edit: true,
      delete: true
    },
    add: {
      addButtonContent: '<i class="material-icons inline-block">add</i>',
      createButtonContent: '<i class="material-icons inline-block">save</i>',
      cancelButtonContent: '<i class="material-icons inline-block text-danger">cancel</i>',
      confirmCreate: true,
    },
    edit: {
      editButtonContent: '<i class="material-icons inline-block">edit</i>',
      saveButtonContent: '<i class="material-icons inline-block">save</i>',
      cancelButtonContent: '<i class="material-icons inline-block text-danger">cancel</i>',
      editConfirm: true
    },
    delete: {
      deleteButtonContent: '<i class="material-icons text-danger">delete</i>',
      deleteConfirm: true
    },
  };


  constructor(
    private formBuilder: FormBuilder,
    private basicDataService: BasicDataService,
    private loogedUserService: LoggedUserService,
    private configurationDataService: ConfigurationDataService,
    private projectService: ProjectService
  ) { }

  ngOnInit() {
    this.loggerUser = this.loogedUserService.getLoggerUser();
    this.configurationData = this.configurationDataService.getConfigurationInfo();

    // this.specie = 'mouse';
    this.keyword = 'symbol';
    this.placeHolder = 'Search for a mouse gene';

    this.projectGenes = new LocalDataSource();
    this.projectLocations = new LocalDataSource();

    this.createProjectForm = this.formBuilder.group({
      workUnit: ['', Validators.required],
      workGroup: ['', Validators.required],
      funder: ['', Validators.required],
      // priority: ['', Validators.required],
      // crispr: [false],
      // projectIntentions: [[], Validators.required],
      projectGenes: [[], Validators.required],
      projectLocations: [[], Validators.required]
    });

    this.createProjectForm.patchValue({
      workUnit: this.loggerUser.workUnitName,
    });

    this.basicDataService.getWorkGroupByWorkUnit(this.f.workUnit.value).pipe(first()).subscribe(data => {
        if (data) {
          this.workGroups = data;
        } else {
          this.workGroups = [];
        }
      },
      error => {
        this.error = error;
    });

    this.backgroundStrains = this.configurationData.trackedStrains;
    console.log('this.backgroundStrains => ', this.configurationData);
    this.backgroundStrainsTable = this.backgroundStrains.map( (strain, index) => {
      const strainName = {
        title: strain,
        value: strain
      };
      return strainName;
    });
    this.locationSettings.columns.backgroundStrain.editor.config.list = this.backgroundStrainsTable;

    // this.priorities = this.configurationData.priorities;
    this.projectIntentions = this.configurationData.alleleTypes;
    this.projectIntentionsTable = this.projectIntentions.map( (intent, index) => {
      const intention = {
        title: intent,
        value: intent
      };
      return intention;
    });
    this.geneSettings.columns.intention.editor.config.list = this.projectIntentionsTable;
    this.locationSettings.columns.intention.editor.config.list = this.projectIntentionsTable;

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

  get f() { return this.createProjectForm.controls; }

  enableFunders(e) {
    this.basicDataService.getAllFundersByWorkGroup(e).pipe(first()).subscribe(data => {
      if (data) {
        this.funders = data;
      } else {
        this.funders = [];
      }
    });
    // this.isDisabled = false;
    // this.f.funder.enable();
  }

  disabledFunder() {
    this.f.funder.reset();
    this.funders = [];
    // this.isDisabled = true;
    // this.f.funder.disable();
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
    if (this.symbol.length > 1) {
      this.basicDataService.findGeneBySymbol(this.symbol).pipe(first()).subscribe(genes => {
        this.genes = genes;
      });
    }
    this.isLoading = false;
  }

  cleanInput(e) {
    // do something when input is added
    this.autocomplete.clear();
  }

  addGene(e) {
    if (this.gene == null) {
      // TODO
      return;
    }
    let gene = new Gene();
    // if (this.specie === 'mouse') {
    //   gene = { specie: this.specie, symbol: this.gene.symbol, geneId: this.gene.mgiId, sequence: '' };
    // } else {
    //   gene = { specie: this.specie, symbol: this.gene.symbol, geneId: this.gene.hgncId, sequence: '' };
    // }
    gene = { symbol: this.gene.symbol, mgiId: this.gene.mgiId, intention: '' };
    this.addGeneToProjectGenes(gene);
    e.stopPropagation();
    this.autocomplete.clear();
    this.autocomplete.close();
    this.gene = null;
  }

  addGeneToProjectGenes(e) {
    this.projectGenes.add(e);
    this.projectGenes.refresh();
    this.f.projectGenes.setValue(this.projectGenes);
  }

  onCreateConfirm(e) {
    e.confirm.resolve();
    this.f.projectLocations.setValue(this.projectLocations);
  }

  orderTableRows() {
    console.log('orderTableRows entra');
  }

  onSubmit() {
    this.submitted = true;
    this.loading = true;

    console.log('invalid => ', this.createProjectForm.invalid);
    console.log('errors onSubmit=> ', this.f.workGroup.errors);

    // stop here if form is invalid
    if (this.createProjectForm.invalid) {
      this.loading = false;
      return;
    }

    this.newProject = {
      workUnit: this.f.workUnit.value,
      workGroup: this.f.workGroup.value[0],
      funder: this.f.funder.value[0],
      // crispr: this.f.crispr.value,
      genes: this.f.projectGenes.value.data,
      locations: this.f.projectLocations.value.data,
    };

    this.projectService.postProject(this.newProject)
        .pipe(first())
        .subscribe(
          data => {
            this.loading = false;
            console.log('Data => ', data);
          },
          error => {
            this.error = error;
            this.loading = false;
            console.log('error: ', this.error);
          }
        );

    console.log('newProject => ', this.newProject);
    this.resetForm();
  }

  resetForm() {
    this.submitted = false;
    // Clean form
    // this.createProjectForm.reset();
    this.f.workGroup.reset('');
    this.f.funder.reset('');
    // this.f.crispr.reset(false);
    this.f.projectGenes.reset([]);
    this.projectGenes.reset();
    this.createProjectForm.reset();
    console.log(this.createProjectForm);
    console.log('createProjectForm cleaned.');
  }

}
