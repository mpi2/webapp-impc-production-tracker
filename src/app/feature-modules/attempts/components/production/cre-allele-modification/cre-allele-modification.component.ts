import { Component, Input, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormGroup, FormBuilder, Validators, Validator,
  AbstractControl, ValidationErrors, NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';

import { CreAlleleModificationAttempt } from '../../../model/production/cre-allele-modification/cre-allele-modification-attempt';
import { CreAlleleModificationStartingPoint } from
            '../../../model/production/cre-allele-modification/starting-point/cre-allele-modification-starting-point';
import { ConfigurationDataService, ConfigurationData } from 'src/app/core';
import { NamedValue } from 'src/app/core/model/common/named-value';

@Component({
  selector: 'app-cre-allele-modification',
  templateUrl: './cre-allele-modification.component.html',
  styleUrls: ['./cre-allele-modification.component.css'],
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CreAlleleModificationComponent),
      multi: true
    },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CreAlleleModificationComponent),
      multi: true
    }
  ]
})
export class CreAlleleModificationComponent implements OnInit, ControlValueAccessor, Validator {
  @Input() creAlleleModificationAttempt: CreAlleleModificationAttempt;
  @Input() creAlleleModificationStartingPoint: CreAlleleModificationStartingPoint;
  @Input() canUpdatePlan: boolean;
  @Input() tpn: string;

  deleterStrains: NamedValue[];
  configurationData: ConfigurationData;

  creAlleleModificationAttemptForm: FormGroup;

  constructor(private configurationDataService: ConfigurationDataService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.loadConfigurationData();
    this.createCreAlleleModttemptForm();
  }

  loadConfigurationData() {
    this.configurationDataService.getConfigurationData().subscribe(data => {
      this.configurationData = data;
      this.deleterStrains = this.configurationData.deleterStrains.map(x => ({ name: x }));
    });
  }

  createCreAlleleModttemptForm() {
    this.creAlleleModificationAttemptForm = this.fb.group({
      modificationExternalRef: [this.creAlleleModificationAttempt.modificationExternalRef], // string;
      numberOfCreMatingsSuccessful: [this.creAlleleModificationAttempt.numberOfCreMatingsSuccessful,
                                      Validators.pattern('^[0-9]*$')], // number;
      tatCre: [this.creAlleleModificationAttempt.tatCre], // boolean;
      deleterStrainName: [this.creAlleleModificationAttempt.deleterStrainName] // string;
    });
  }

  onExternalRefChange() {
    this.creAlleleModificationAttempt.modificationExternalRef = this.creAlleleModificationAttemptForm.get('modificationExternalRef').value;
  }

  onTatCreChange() {
    this.creAlleleModificationAttempt.tatCre  = this.creAlleleModificationAttemptForm.get('tatCre').value;
  }

  onDeleterStrainNameChange() {
    this.creAlleleModificationAttempt.deleterStrainName = this.creAlleleModificationAttemptForm.get('deleterStrainName').value;
  }

  onNumberOfCreMatingsSuccessfulChange() {
    this.creAlleleModificationAttempt.numberOfCreMatingsSuccessful =
                                        this.creAlleleModificationAttemptForm.get('numberOfCreMatingsSuccessful').value;
  }

  writeValue(obj: any): void {
    if (obj) {
      this.creAlleleModificationAttemptForm.setValue(obj, { emitEvent: false });
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
      this.creAlleleModificationAttemptForm.disable();
    } else {
      this.creAlleleModificationAttemptForm.enable();
    }
  }

  // Received a callback, when ever our form value changes it reports the new value to the parent form
  // registers 'fn' that will be fired when changes are made
  // this is how we emit the changes back to the form
  registerOnChange(fn: any): void {
    this.creAlleleModificationAttemptForm.valueChanges.subscribe(fn);
  }

  validate(c: AbstractControl): ValidationErrors | null {
    // console.log('creAlleleModificationAttemptForm validation: ', this.creAlleleModificationAttemptForm.valid);
    return this.creAlleleModificationAttemptForm.valid ? null : { invalidForm: {valid: false,
                                      message: 'creAlleleModAttemptForm fields are invalid'} };
  }

}
