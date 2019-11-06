import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfigurationData, LoggedUserService, ConfigurationDataService, GeneService } from 'src/app/core';
import { FormControl } from '@angular/forms';
import { NewProject } from '../../model/newProject';
import { FunderService } from 'src/app/core/services/funder.service';
import { ProjectService } from '../..';
import { Gene } from 'src/app/model/bio/gene';

import { HttpClient } from '@angular/common/http';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { MatDialog, MatTable } from '@angular/material';
import { DialogBoxComponent } from 'src/app/shared/components/dialog-box/dialog-box.component';

export interface UsersData {
  name: string;
  id: number;
}

const ELEMENT_DATA: UsersData[] = [
  {id: 1560608769632, name: 'Artificial Intelligence'},
  {id: 1560608796014, name: 'Machine Learning'},
  {id: 1560608787815, name: 'Robotic Process Automation'},
  {id: 1560608805101, name: 'Blockchain'}
];
@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css']
})
export class CreateProjectComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'action'];
  dataSource = ELEMENT_DATA;

  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  searchGenesCtrl = new FormControl();
  filteredGenes: string[] = [];
  genesSelected: string[] = [];
  isLoading2 = false;
  errorMsg: string;

  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';
  workGroups: string[] = [];
  workUnits: string[] = [];
  projectIntentions: string[] = [];
  projectIntentionsTable: any;
  funders: any[] = [];
  backgroundStrains: string[] = [];
  backgroundStrainsTable: any;
  symbol: string;
  genes: Gene[] = [];
  gene: Gene;
  genesLoading = false;
  keyword: string;
  isLoading = false;
  placeHolder: string;
  newProject: NewProject;
  configurationData: ConfigurationData;
  isDisabled = true;
  privacies: NamedValue[] = [];
  species: NamedValue[] = [];
  consortia: NamedValue[] = [];
  institutes: NamedValue[] = [];

  @ViewChild(MatTable, { static: true }) table: MatTable<any>;

  constructor(
    private formBuilder: FormBuilder,
    private funderService: FunderService,
    private geneService: GeneService,
    private loogedUserService: LoggedUserService,
    private configurationDataService: ConfigurationDataService,
    private projectService: ProjectService,

    private formBuilder2: FormBuilder,
    private http: HttpClient,

    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.configurationDataService.getConfigurationData().subscribe(data => {
      this.configurationData = data;
      console.log('this.configurationData => ', this.configurationData);
      this.privacies = this.configurationData.privacies.map(x => ({ name: x }));
      this.species = this.configurationData.species.map(x => ({ name : x}));
    });

    this.firstFormGroup = this.formBuilder2.group({
      // firstCtrl: ['', Validators.required],
      withdrawn: [''],
      recovery: [''],
      is_active: [''],
      privacy: ['', Validators.required],
      species: [[], Validators.required],
      consortia: [[]],
      institutes: [[]],
      intentionType: ['', Validators.required],
      comment: [''],
      external_ref: [''],
      genesSelected: [[]]
    });

    this.secondFormGroup = this.formBuilder2.group({
      secondCtrl: ['', Validators.required]
    });

    this.searchGenesCtrl.valueChanges
      .pipe(
        debounceTime(500),
        tap(() => {
          this.errorMsg = '';
          this.filteredGenes = [];
          this.isLoading = true;
        }),
        switchMap(value => this.geneService.findGenesExternalDataBySymbol(value)
          .pipe(
            finalize(() => {
              this.isLoading = false;
            }),
          )
        )
      )
      .subscribe(data => {
        // console.log(data);
        if (data === undefined) {
          this.errorMsg = data['Error'];
          this.filteredGenes = [];
        } else {
          this.errorMsg = '';
          this.filteredGenes = data;
      }
    });
  }

  addGene() {
    this.genesSelected.push(this.searchGenesCtrl.value);
    this.searchGenesCtrl.setValue('');
  }

  deleteGene(gene) {
    const index: number = this.genesSelected.indexOf(gene);
    if (index !== -1) {
        this.genesSelected.splice(index, 1);
    }
  }

  openDialog(action, obj) {
    obj.action = action;
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: '250px',
      data: obj
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.event === 'Add') {
        this.addRowData(result.data);
      } else if (result.event === 'Update') {
        this.updateRowData(result.data);
      } else if (result.event === 'Delete') {
        this.deleteRowData(result.data);
      }
    });
  }

  addRowData(rowObj) {
    const d = new Date();
    this.dataSource.push({
      id: d.getTime(),
      name: rowObj.name
    });
    this.table.renderRows();

  }
  updateRowData(rowObj) {
    this.dataSource = this.dataSource.filter((value, key) => {
      if (value.id === rowObj.id) {
        value.name = rowObj.name;
      }
      return true;
    });
  }
  deleteRowData(rowObj) {
    this.dataSource = this.dataSource.filter((value, key) => {
      return value.id !== rowObj.id;
    });
  }

}
