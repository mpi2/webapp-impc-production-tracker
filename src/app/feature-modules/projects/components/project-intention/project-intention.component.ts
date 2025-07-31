import { Component, OnInit, Input, forwardRef, ElementRef } from '@angular/core';
import { ConfigurationData, ConfigurationDataService, GeneService } from 'src/app/core';
import { ControlValueAccessor, FormControl, FormGroup, FormBuilder, Validators, Validator,
  AbstractControl, ValidationErrors, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormArray } from '@angular/forms';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';

import { NamedValue } from 'src/app/core/model/common/named-value';
import { MatDialog } from '@angular/material/dialog';

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
    ],
    standalone: false
})
export class ProjectIntentionComponent implements OnInit, ControlValueAccessor, Validator {
  @Input() projectCreation: boolean;

  configurationData: ConfigurationData;
  allMutationCategorizations: NamedValue[];
  molecularMutationTypes: NamedValue[];
  mutationCategorizationsByType = new Map<string, NamedValue[]>();

  searchGeneCtrl = new FormControl();
  filteredGenes: any;
  isLoading = false;
  errorMsg: string;

  mutationCategorizationNames: string[];
  alleleCategoryKey = 'allele_category';

  projectIntentionsForm: FormGroup;

  constructor(
    private configurationDataService: ConfigurationDataService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private geneService: GeneService,
    private elementRef: ElementRef)
  {
    this.loadConfigurationData();
  }

  get intentions(): FormArray {
    return this.projectIntentionsForm.get('intentions') as FormArray;
  }

  ngOnInit() {
    this.createProjectIntentionsForm();

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

  }

  createProjectIntentionsForm() {
    this.projectIntentionsForm = this.fb.group({
      intentions: this.fb.array([this.newIntentionFormGroup()])
    });
  }

  newIntentionFormGroup(): FormGroup {
    return this.fb.group({
      molecularMutationType: ['', Validators.required],
      mutationCategorizations: [[]],
      geneSymbol: ['', Validators.required]
    });
  }

  addIntentionButtonClick() {
    const newIntention = this.newIntentionFormGroup();
    this.intentions.push(newIntention);
    const inputId = '#geneSymbol' + (this.intentions.length - 1);
    setTimeout(()=>{ // this will make the execution after the above boolean has changed
      this.elementRef.nativeElement.querySelector(inputId).value = '';
    },0);
  }

  removeIntentionButtonClick(i: number) {
    if (this.intentions.length > 1) {
      this.intentions.removeAt(i);
    } else {
      this.intentions.reset();
    }
  }


  geneInput(i: number, symbol: string) {

  }

  geneSelected(i: number, geneSelected: any) {
    const intentions = this.projectIntentionsForm.get('intentions') as FormArray;
    intentions.at(i).patchValue({geneSymbol: geneSelected.symbol});
  }

  loadConfigurationData() {
    this.configurationDataService.getConfigurationData().subscribe(data => {
      this.configurationData = data;
      this.allMutationCategorizations = this.configurationData.mutationCategorizations.map(x => ({ name: x }));
      this.molecularMutationTypes = this.configurationData.molecularMutationTypes.map(x => ({ name: x })).filter(n => n.name !== 'legacy');

      Object.keys(this.configurationData.mutationCategorizationsByType).map(key => {
        const list = this.configurationData.mutationCategorizationsByType[key];
        this.mutationCategorizationsByType[key] = list.map(x => ({ name: x }));
      });
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
}
