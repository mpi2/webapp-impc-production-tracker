import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfigurationData, ConfigurationDataService, GeneService, Gene } from 'src/app/core';
import { FormControl } from '@angular/forms';

import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { DialogBoxComponent } from 'src/app/shared/components/dialog-box/dialog-box.component';
import { NamedValue } from 'src/app/core/model/common/named-value';

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
  displayedColumnsGenes: string[] = ['symbol', 'accId', 'action'];

  projectFormGroup: FormGroup;
  planFormGroup: FormGroup;

  searchGenesCtrl = new FormControl();
  filteredGenes: string[] = [];
  genesSelected: Gene[] = [];
  // seqLocSelected: Sequence[] = [];
  // geneSequence: Sequence[] = [];
  isLoading = false;
  isLinear = false;
  errorMsg: string;
  configurationData: ConfigurationData;

  privacies: NamedValue[] = [];
  species: NamedValue[] = [];
  consortia: NamedValue[] = [];
  institutes: NamedValue[] = [];
  molecularMutTypes: NamedValue[] = [];
  molecularMutationTypes: NamedValue[] = [];
  mutationCategorizations: NamedValue[] = [];
  sequenceTypes: NamedValue[] = [];
  sequenceCategorizations: NamedValue[] = [];
  funders: NamedValue[] = [];
  workUnits: NamedValue[] = [];
  planTypes: NamedValue[] = [];
  attemptTypes: NamedValue[] = [];

  @ViewChild(MatTable) table: MatTable<any>;

  constructor(
    private geneService: GeneService,
    private configurationDataService: ConfigurationDataService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private formBuilder2: FormBuilder,
  ) { }

  ngOnInit() {
    this.configurationDataService.getConfigurationData().subscribe(data => {
      this.configurationData = data;
      console.log(this.configurationData);
      this.privacies = this.configurationData.privacies.map(x => ({ name: x }));
      this.species = this.configurationData.species.map(x => ({ name: x}));
      this.institutes = this.configurationData.institutes.map(x => ({ name: x}));
      this.consortia = this.configurationData.consortia.map(x => ({ name: x}));
      this.molecularMutationTypes = this.configurationData.molecularMutationTypes.map(x => ({ name: x}));
      this.mutationCategorizations = this.configurationData.mutationCategorizations.map(x => ({ name: x}));
      this.sequenceTypes = this.configurationData.sequenceTypes.map(x => ({ name: x}));
      this.sequenceCategorizations = this.configurationData.sequenceCategorizations.map(x => ({ name: x}));
      this.funders = this.configurationData.funders.map(x => ({ name: x }));
      this.workUnits = this.configurationData.workUnits.map(x => ({ name: x }));
      this.planTypes = this.configurationData.planTypes.map(x => ({ name: x }));
      this.attemptTypes = this.configurationData.attemptTypes.map(x => ({ name: x }));
    });

    this.projectFormGroup = this.formBuilder.group({
      withdrawn: [''],
      recovery: [''],
      is_active: [true],
      privacy: ['', Validators.required],
      species: [[], Validators.required],
      consortiumInstitutes: [[]],
      comment: [''],
      external_ref: [''],
      intention: [[]]
    });

    this.planFormGroup = this.formBuilder2.group({
      funder: [''],
      workUnit: ['', Validators.required],
      planType: ['', Validators.required],
      attemptType: ['', Validators.required],
      is_active: [true],
      comment: [''],
      products_available_for_general_public: ['']
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

  onSubmit() {
    console.log('Project definition finished.');
  }

}
