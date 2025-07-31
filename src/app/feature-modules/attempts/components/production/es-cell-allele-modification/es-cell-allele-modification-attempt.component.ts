import { Component, Input, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormGroup, FormBuilder, Validators, Validator,
  AbstractControl, ValidationErrors, NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';

import { EsCellAlleleModificationAttempt } from '../../../model/production/es-cell-allele-modification/es-cell-allele-modification-attempt';
import { EsCellAlleleModificationStartingPoint } from
            '../../../model/production/es-cell-allele-modification/starting-point/es-cell-allele-modification-starting-point';
import { ConfigurationDataService, ConfigurationData } from 'src/app/core';
import { NamedValue } from 'src/app/core/model/common/named-value';

@Component({
    selector: 'app-es-cell-allele-modification-attempt',
    templateUrl: './es-cell-allele-modification-attempt.component.html',
    styleUrls: ['./es-cell-allele-modification-attempt.component.css'],
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => EsCellAlleleModificationAttemptComponent),
            multi: true
        },
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => EsCellAlleleModificationAttemptComponent),
            multi: true
        }
    ],
    standalone: false
})
export class EsCellAlleleModificationAttemptComponent implements OnInit, ControlValueAccessor, Validator {
  @Input() esCellAlleleModificationAttempt: EsCellAlleleModificationAttempt;
  @Input() esCellAlleleModificationStartingPoint: EsCellAlleleModificationStartingPoint;
  @Input() canUpdatePlan: boolean;
  @Input() tpn: string;

  deleterStrains: NamedValue[];
  configurationData: ConfigurationData;

  esCellAlleleModificationAttemptForm: FormGroup;

  constructor(private configurationDataService: ConfigurationDataService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.loadConfigurationData();
    this.createEsCellAlleleModttemptForm();
  }

  loadConfigurationData() {
    this.configurationDataService.getConfigurationData().subscribe(data => {
      this.configurationData = data;
      this.deleterStrains = this.configurationData.deleterStrains.map(x => ({ name: x }));
    });
  }

  createEsCellAlleleModttemptForm() {
    this.esCellAlleleModificationAttemptForm = this.fb.group({
      modificationExternalRef: [this.esCellAlleleModificationAttempt.modificationExternalRef], // string;
      numberOfCreMatingsSuccessful: [this.esCellAlleleModificationAttempt.numberOfCreMatingsSuccessful,
                                      Validators.pattern('^[0-9]*$')], // number;
      tatCre: [this.esCellAlleleModificationAttempt.tatCre], // boolean;
      deleterStrainName: [this.esCellAlleleModificationAttempt.deleterStrainName], // string;
      imitsMouseAlleleModId: [this.esCellAlleleModificationAttempt.imitsMouseAlleleModId],
      imitsTargRepAlleleId: [this.esCellAlleleModificationAttempt.imitsTargRepAlleleId]
    });
  }

  onExternalRefChange() {
    this.esCellAlleleModificationAttempt.modificationExternalRef =
                this.esCellAlleleModificationAttemptForm.get('modificationExternalRef').value;
  }

  onTatCreChange() {
    this.esCellAlleleModificationAttempt.tatCre  = this.esCellAlleleModificationAttemptForm.get('tatCre').value;
  }

  onDeleterStrainNameChange() {
    this.esCellAlleleModificationAttempt.deleterStrainName = this.esCellAlleleModificationAttemptForm.get('deleterStrainName').value;
  }

  onNumberOfCreMatingsSuccessfulChange() {
    this.esCellAlleleModificationAttempt.numberOfCreMatingsSuccessful =
                                        this.esCellAlleleModificationAttemptForm.get('numberOfCreMatingsSuccessful').value;
  }

  writeValue(obj: any): void {
    if (obj) {
      this.esCellAlleleModificationAttemptForm.setValue(obj, { emitEvent: false });
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
      this.esCellAlleleModificationAttemptForm.disable();
    } else {
      this.esCellAlleleModificationAttemptForm.enable();
    }
  }

  // Received a callback, when ever our form value changes it reports the new value to the parent form
  // registers 'fn' that will be fired when changes are made
  // this is how we emit the changes back to the form
  registerOnChange(fn: any): void {
    this.esCellAlleleModificationAttemptForm.valueChanges.subscribe(fn);
  }

  validate(c: AbstractControl): ValidationErrors | null {
    return this.esCellAlleleModificationAttemptForm.valid ? null : { invalidForm: {valid: false,
                                      message: 'esCellAlleleModAttemptForm fields are invalid'} };
  }

}
