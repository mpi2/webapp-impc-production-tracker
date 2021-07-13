import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { ConfigurationData, ConfigurationDataService, Gene, GeneService } from 'src/app/core';
import { ControlValueAccessor, FormControl, FormGroup, FormBuilder, Validators, Validator,
  AbstractControl, ValidationErrors, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormArray } from '@angular/forms';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';

import { NamedValue } from 'src/app/core/model/common/named-value';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationComponent } from 'src/app/shared/components/delete-confirmation/delete-confirmation.component';
import { ProjectCreation } from '../../model/project-creation';
import { ProjectIntention } from '../../model/project-intention';
import { IntentionByGene, MutationCategorization } from 'src/app/model';


@Component({
  selector: 'app-project-intention',
  templateUrl: './project-intention.component.html',
  styleUrls: ['./project-intention.component.css'],
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ProjectIntentionComponent),
      multi: true
    },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ProjectIntentionComponent),
      multi: true
    }
  ]
})
export class ProjectIntentionComponent implements OnInit, ControlValueAccessor, Validator {
  @Input() projectCreation: boolean;

  configurationData: ConfigurationData;
  allMutationCategorizations: NamedValue[];
  molecularMutationTypes: NamedValue[];

  searchGeneCtrl = new FormControl();
  filteredGenes: any;
  isLoading = false;
  errorMsg: string;

  mutationCategorizationNames: string[];

  tmpIndexRowName = 'tmp_id';
  nextNewId = -1;

  projectIntentionsForm: FormGroup;

  constructor(
    private configurationDataService: ConfigurationDataService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private geneService: GeneService
  ) { }

  ngOnInit() {
    this.loadConfigurationData();

    this.searchGeneCtrl.valueChanges
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

    this.projectIntentionsForm = this.fb.group({
      intentions: this.fb.array([this.addIntentionFormGroup()])
    });
  }

  addIntentionFormGroup(): FormGroup {
    return this.fb.group({
      molecularMutationType: ['', Validators.required],
      mutationCategorizations: [[]],
      geneSymbol: ['', Validators.required]
    });
  }

  addIntentioButtonClick(): void {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const control = <FormArray>this.projectIntentionsForm.get('intentions');
    control.push(this.addIntentionFormGroup());
  }

  removeIntentioButtonClick(i: number) {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const control = <FormArray>this.projectIntentionsForm.get('intentions');
    control.removeAt(i);
  }

  geneSelected(i: number, symbol: string) {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const intention = (<FormArray>this.projectIntentionsForm.get('intentions')).at(i);
    intention.patchValue({geneSymbol: symbol});
  }

  loadConfigurationData() {
    this.configurationDataService.getConfigurationData().subscribe(data => {
      this.configurationData = data;
      this.allMutationCategorizations = this.configurationData.mutationCategorizations.map(x => ({ name: x }));
      this.molecularMutationTypes = this.configurationData.molecularMutationTypes.map(x => ({ name: x }));
    });
  }

  writeValue(obj: any): void {
    if (obj) {
      this.projectIntentionsForm.setValue(obj, { emitEvent: false });
    }
  }

  onTouched = () => void {};
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // Disable or enable the form control
  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.projectIntentionsForm.disable();
    } else {
      this.projectIntentionsForm.enable();
    }
  }

  // Received a callback, when ever our form value changes it reports the new value to the parent form
  registerOnChange(fn: any): void {
    this.projectIntentionsForm.valueChanges.subscribe(fn);
  }

  validate(c: AbstractControl): ValidationErrors | null {
    return this.projectIntentionsForm.valid ? null : { invalidForm: {valid: false, message: 'consortiaForm fields are invalid'} };
  }


  // addRow() {
  //   const intention: ProjectIntention = new ProjectIntention();
  //   intention[this.tmpIndexRowName] = this.nextNewId--;
  //   if (!this.projectCreation.projectIntentions) {
  //     this.projectCreation.projectIntentions = [];
  //   }
  //   this.projectCreation.projectIntentions.push(intention);
  // }

  // addGeneToIntention(projectIntention: ProjectIntention, gene: any) {
  //   projectIntention.intentionByGene = new IntentionByGene();
  //   projectIntention.intentionByGene.gene = new Gene();
  //   projectIntention.intentionByGene.gene.symbol = gene.symbol;
  //   projectIntention.intentionByGene.gene.accessionId = gene.accId;
  // }

  // addMutationCategorization(projectIntention: ProjectIntention, names: string[]) {
  //   projectIntention.mutationCategorizations = [];
  //   names.forEach((name) => {
  //     const mutationCategorization = new MutationCategorization();
  //     mutationCategorization.name = name;
  //     projectIntention.mutationCategorizations.push(mutationCategorization);
  //   });
  // }

  // deleteRow(intention: ProjectIntention) {
  //   if (this.isNewRecord(intention)) {
  //     this.deleteProjectIntention(intention);
  //   } else {
  //     this.showDeleteConfirmationDialog(intention);
  //   }
  // }

  // showDeleteConfirmationDialog(intention: ProjectIntention) {
  //   const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
  //     width: '250px',
  //     data: { confirmed: false }
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       this.deleteProjectIntention(intention);
  //     }
  //   });
  // }

  // deleteProjectIntention(intention: ProjectIntention) {
  //   if (this.isNewRecord(intention)) {
  //     this.projectCreation.projectIntentions = this.projectCreation.projectIntentions
  //       .filter(x => x[this.tmpIndexRowName] !== intention[this.tmpIndexRowName]);
  //   } else {
  //     this.projectCreation.projectIntentions = this.projectCreation.projectIntentions
  //       .filter(x => x.id !== intention.id);
  //   }
  // }

  // private isNewRecord(intention: ProjectIntention) {
  //   return intention.id === null;
  // }
}
