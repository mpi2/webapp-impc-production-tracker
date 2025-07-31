import { Component, Input, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormGroup, FormBuilder, Validators, Validator,
  AbstractControl, ValidationErrors, NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';

import { CrisprAlleleModificationAttempt } from '../../../model/production/crispr-allele-modification/crispr-allele-modification-attempt';
import { CrisprAlleleModificationStartingPoint } from
            '../../../model/production/crispr-allele-modification/starting-point/crispr-allele-modification-starting-point';
import { ConfigurationDataService, ConfigurationData } from 'src/app/core';
import { NamedValue } from 'src/app/core/model/common/named-value';

@Component({
    selector: 'app-crispr-allele-modification-attempt',
    templateUrl: './crispr-allele-modification-attempt.component.html',
    styleUrls: ['./crispr-allele-modification-attempt.component.css'],
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => CrisprAlleleModificationAttemptComponent),
            multi: true
        },
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CrisprAlleleModificationAttemptComponent),
            multi: true
        }
    ],
    standalone: false
})
export class CrisprAlleleModificationAttemptComponent implements OnInit, ControlValueAccessor, Validator {
  @Input() crisprAlleleModificationAttempt: CrisprAlleleModificationAttempt;
  @Input() crisprAlleleModificationStartingPoint: CrisprAlleleModificationStartingPoint;
  @Input() canUpdatePlan: boolean;
  @Input() tpn: string;

  deleterStrains: NamedValue[];
  configurationData: ConfigurationData;

  crisprAlleleModificationAttemptForm: FormGroup;

  constructor(private configurationDataService: ConfigurationDataService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.loadConfigurationData();
    this.createCrisprAlleleModttemptForm();
  }

  loadConfigurationData() {
    this.configurationDataService.getConfigurationData().subscribe(data => {
      this.configurationData = data;
      this.deleterStrains = this.configurationData.deleterStrains.map(x => ({ name: x }));
    });
  }

  createCrisprAlleleModttemptForm() {
    this.crisprAlleleModificationAttemptForm = this.fb.group({
      modificationExternalRef: [this.crisprAlleleModificationAttempt.modificationExternalRef], // string;
      numberOfCreMatingsSuccessful: [this.crisprAlleleModificationAttempt.numberOfCreMatingsSuccessful,
                                      Validators.pattern('^[0-9]*$')], // number;
      tatCre: [this.crisprAlleleModificationAttempt.tatCre], // boolean;
      deleterStrainName: [this.crisprAlleleModificationAttempt.deleterStrainName]
    });
  }

  onExternalRefChange() {
    this.crisprAlleleModificationAttempt.modificationExternalRef =
                this.crisprAlleleModificationAttemptForm.get('modificationExternalRef').value;
  }

  onTatCreChange() {
    this.crisprAlleleModificationAttempt.tatCre  = this.crisprAlleleModificationAttemptForm.get('tatCre').value;
  }

  onDeleterStrainNameChange() {
    this.crisprAlleleModificationAttempt.deleterStrainName = this.crisprAlleleModificationAttemptForm.get('deleterStrainName').value;
  }

  onNumberOfCreMatingsSuccessfulChange() {
    this.crisprAlleleModificationAttempt.numberOfCreMatingsSuccessful =
                                        this.crisprAlleleModificationAttemptForm.get('numberOfCreMatingsSuccessful').value;
  }

  writeValue(obj: any): void {
    if (obj) {
      this.crisprAlleleModificationAttemptForm.setValue(obj, { emitEvent: false });
    }
  }

  onTouched = () => void {}; // initialize it with an empty function
  // When we want to report that this form is being touched by the user. Meaning, that the user has tried to interact with the form somehow.
  // It received a function.
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // Disable or enable the form control
  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.crisprAlleleModificationAttemptForm.disable();
    } else {
      this.crisprAlleleModificationAttemptForm.enable();
    }
  }

  // Received a callback, when ever our form value changes it reports the new value to the parent form
  // registers 'fn' that will be fired when changes are made
  // this is how we emit the changes back to the form
  registerOnChange(fn: any): void {
    this.crisprAlleleModificationAttemptForm.valueChanges.subscribe(fn);
  }

  validate(c: AbstractControl): ValidationErrors | null {
    return this.crisprAlleleModificationAttemptForm.valid ? null : { invalidForm: {valid: false,
                                      message: 'crisprAlleleModAttemptForm fields are invalid'} };
  }

}
