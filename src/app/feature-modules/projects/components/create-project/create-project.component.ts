import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfigurationData, ConfigurationDataService, GeneService, Gene } from 'src/app/core';
import { FormControl } from '@angular/forms';

import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { MatDialog, MatTable } from '@angular/material';
import { DialogBoxComponent } from 'src/app/shared/components/dialog-box/dialog-box.component';
import { Sequence } from 'src/app/model';

export interface UsersData {
  name: string;
  index: number;
}

const ELEMENT_DATA: UsersData[] = [
  {index: 1, name: 'Artificial Intelligence'},
  {index: 2, name: 'Machine Learning'},
  {index: 3, name: 'Robotic Process Automation'},
  {index: 4, name: 'Blockchain'}
];

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css']
})
export class CreateProjectComponent implements OnInit {
  displayedColumnsGenes: string[] = ['symbol', 'accId', 'molecularMutType', 'alleleType', 'action'];
  displayedColumnsSequenceLocation: string[] = ['index', 'name', 'action'];
  dataSource = ELEMENT_DATA;

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  searchGenesCtrl = new FormControl();
  filteredGenes: string[] = [];
  genesSelected: Gene[] = [];
  seqLocSelected: Sequence[] = [];
  isLoading = false;
  isLinear = false;
  errorMsg: string;
  configurationData: ConfigurationData;

  privacies: NamedValue[] = [];
  species: NamedValue[] = [];
  consortia: NamedValue[] = [];
  institutes: NamedValue[] = [];
  molecularMutTypes: NamedValue[] = [];
  alleleTypes: NamedValue[] = [];

  @ViewChild(MatTable, { static: false }) table: MatTable<any>;

  constructor(
    private geneService: GeneService,
    private configurationDataService: ConfigurationDataService,
    private formBuilder2: FormBuilder,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.configurationDataService.getConfigurationData().subscribe(data => {
      this.configurationData = data;
      this.privacies = this.configurationData.privacies.map(x => ({ name: x }));
      this.species = this.configurationData.species.map(x => ({ name: x}));
      this.institutes = this.configurationData.institutes.map(x => ({ name: x}));
      this.consortia = this.configurationData.consortia.map(x => ({ name: x}));
      this.alleleTypes = this.configurationData.alleleTypes.map(x => ({ name: x}));
      this.molecularMutTypes = this.configurationData.molecularMutationTypes.map(x => ({ name: x}));
    });

    this.firstFormGroup = this.formBuilder2.group({
      withdrawn: [''],
      recovery: [''],
      is_active: [''],
      privacy: ['', Validators.required],
      species: [[], Validators.required],
      consortiumInstitutes: [[]],
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
        if (data.length === 0) {
          // this.errorMsg = data['Error'];
          this.errorMsg = 'Symbol does not exist.';
          this.filteredGenes = [];
        } else {
          this.errorMsg = '';
          this.filteredGenes = data;
      }
    });
  }

  addGene() {
    const index: number = this.genesSelected.findIndex(x => x.symbol === this.searchGenesCtrl.value.symbol);
    if (index === -1) {
      this.genesSelected.push(this.searchGenesCtrl.value);
      this.searchGenesCtrl.setValue('');
      this.table.renderRows();
    } else {
      this.openDialogGenes('', this.searchGenesCtrl.value);
      this.searchGenesCtrl.setValue('');
    }
  }

  deleteSelectedGene(gene) {
    this.genesSelected = this.genesSelected.filter((value, key) => {
      return value.symbol !== gene.symbol;
    });
    this.table.renderRows();
  }

  openDialogGenes(action, obj) {
    obj.action = action;
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: '250px',
      data: obj
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.event === 'Delete') {
        this.deleteSelectedGene(result.data);
      }
    });
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
      } else if (result.event === 'Delete') {
        this.deleteRowData(result.data);
      }
    });
  }

  addRowData(rowObj) {
    const d = new Date();
    this.dataSource.push({
      index: d.getTime(),
      name: rowObj.name
    });
    this.table.renderRows();
  }

  editLocationSequence(rowObj) {
    // this.dataSource = this.dataSource.filter((value, key) => {
    //   if (value.id === rowObj.id) {
    //     value.name = rowObj.name;
    //   }
    //   return true;
    // });
  }

  deleteRowData(rowObj) {
    this.dataSource = this.dataSource.filter((value, key) => {
      return value.index !== rowObj.id;
    });
  }

  onSubmit() {
    console.log('Project definition finished.');
  }

}
