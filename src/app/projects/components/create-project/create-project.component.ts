
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { WorkGroup, Gene } from '../../../core/model';
import { first } from 'rxjs/operators';
import { LoggedUserService } from '../../../core/services/logged-user.service';
import { LoggedUser } from '../../../core/model/logged-user';
import { ConfigurationDataService } from '../../../core/services/configuration-data.service';
import { ConfigurationData } from '../../../core/model/configuration-data';
import { BasicDataService } from 'src/app/core/services/basic-data.service';
import { LocalDataSource } from 'ng2-smart-table';


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
  workUnit = '';
  workGroups: WorkGroup[] = [];
  priorities: string[] = [];
  // projectLocation: Gene[] = [];
  projectIntentions: string[] = [];
  symbol: string;
  genes: Gene[] = [];
  gene: any;
  genesLoading = false;
  specie: string;
  keyword: string;
  isLoading = false;
  placeHolder: string;
  showGeneTable = false;
  loggerUser: LoggedUser;
  configurationData: ConfigurationData;

  source: LocalDataSource;
  settings = {
    mode: external,
    hideSubHeader: true,
    columns: {
      specie: {
        title: 'Specie',
        editable: false
      },
      symbol: {
        title: 'Gene Symbol',
        editable: false
      },
      geneId: {
        title: 'Gene id',
        editable: false
      },
      sequence: {
        title: 'Sequence',
        editable: true
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
      deleteButtonContent: '<i class="material-icons text-danger">delete</i>'
    },
  };

  constructor(
    private formBuilder: FormBuilder,
    private basicDataService: BasicDataService,
    private loogedUserService: LoggedUserService,
    private configurationDataService: ConfigurationDataService) { }

  ngOnInit() {
    this.specie = 'mouse';
    this.keyword = 'symbol';
    this.placeHolder = 'Search for a gene';

    this.source = new LocalDataSource();

    this.createProjectForm = this.formBuilder.group({
      workGroup: ['', Validators.required],
      priority: ['', Validators.required],
      projectIntention: ['', Validators.required],
    });

    this.loggerUser = this.loogedUserService.getLoggerUser();
    this.configurationData = this.configurationDataService.getConfigurationInfo();

    this.workUnit = this.loggerUser.workUnitName;
    if (!this.workUnit) {
      this.workUnit = '';
    }
    console.log(this.workUnit);

    this.basicDataService.getWorkGroupByWorkUnit(this.workUnit).pipe(first()).subscribe(data => {
      if (data) {
        this.workGroups = data;
        console.log('workGroups: ', this.workGroups);
      } else {
        this.workGroups = [];
        console.log('workGroups: ', this.workGroups);
      }
    },
    error => {
      this.error = error;
    });

    this.priorities = this.configurationData.priorities;
    this.projectIntentions = this.configurationData.alleleTypes;

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
      this.basicDataService.findGeneBySymbol(this.symbol, this.specie).pipe(first()).subscribe(genes => {
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
    // Create object for adding
    let gene = new Gene();
    if (this.specie === 'mouse') {
      gene = { specie: this.specie, symbol: this.gene.symbol, geneId: this.gene.mgiId, sequence: '' };
    } else {
      gene = { specie: this.specie, symbol: this.gene.symbol, geneId: this.gene.hgncId, sequence: '' };
    }
    this.onCreateConfirm(gene);
  }

  onCreateConfirm(e) {
    this.source.add(e);
    console.log('onCreateConfirm gene => ', e);
    this.source.refresh();
    console.log('onCreateConfirm projectLocation => ', this.source);
  }

  onSubmit() {
    console.log('Entra onSubmit.');
  }

}
