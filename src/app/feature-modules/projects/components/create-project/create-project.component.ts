import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { first } from 'rxjs/operators';
import { WorkGroup, Gene, LoggedUser, ConfigurationData, LoggedUserService, ConfigurationDataService, 
  WorkGroupService, GeneService } from 'src/app/core';
import { NewProject } from '../../model/newProject';
import { FunderService } from 'src/app/core/services/funder.service';
import { ProjectService } from '../..';

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
  funders: any[] = [];
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

  @ViewChild('autocomplete',  {static: true}) autocomplete;

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
        valuePrepareFunction: (row) => {
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
    private funderService: FunderService,
    private geneService: GeneService,
    private workGroupService: WorkGroupService,
    private loogedUserService: LoggedUserService,
    private configurationDataService: ConfigurationDataService,
    private projectService: ProjectService
  ) { }

  ngOnInit() {
    this.loggerUser = this.loogedUserService.getLoggerUser();
    this.configurationData = this.configurationDataService.getConfigurationInfo();

    this.keyword = 'symbol';
    this.placeHolder = 'Search for a mouse gene';

    this.projectGenes = new LocalDataSource();
    this.projectLocations = new LocalDataSource();

    this.createProjectForm = this.formBuilder.group({
      workUnit: ['', Validators.required],
      workGroup: ['', Validators.required],
      funder: ['', Validators.required],
      projectGenes: [[], Validators.required],
      projectLocations: [[], Validators.required]
    });

    this.createProjectForm.patchValue({
      workUnit: this.loggerUser.workUnitName,
    });
    console.log(this.loggerUser);

    this.workGroupService.getWorkGroupByWorkUnit(this.f.workUnit.value).pipe(first()).subscribe(data => {
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
    this.funderService.getAllFundersByWorkGroup(e).pipe(first()).subscribe(data => {
      if (data) {
        this.funders = data;
      } else {
        this.funders = [];
      }
    });
  }

  disabledFunder() {
    this.f.funder.reset();
    this.funders = [];
  }

  selectEvent(item) {
    // do something with selected item
    this.gene = item;
  }

  onChangeSearch(val: string) {
    // And reassign the 'data' which is binded to 'data' property.
    this.isLoading = true;
    this.symbol = val;
    if (this.symbol.length > 1) {
      this.geneService.findGenesBySymbol(this.symbol).pipe(first()).subscribe(genes => {
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

    if (this.createProjectForm.invalid) {
      this.loading = false;
      return;
    }

    this.newProject = {
      workUnit: this.f.workUnit.value,
      workGroup: this.f.workGroup.value[0],
      funder: this.f.funder.value[0],
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
    this.f.workGroup.reset('');
    this.f.funder.reset('');
    this.f.projectGenes.reset([]);
    this.projectGenes.reset();
    this.createProjectForm.reset();
    console.log(this.createProjectForm);
    console.log('createProjectForm cleaned.');
  }

  onSaveConfirm() {
    // METHOD TO DO
  }

}
