import { Component, Input, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormGroup, FormBuilder, Validators, Validator,
  AbstractControl, ValidationErrors, NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';

import { Project, EsCellQc } from 'src/app/model';
import { ConfigurationDataService, ConfigurationData } from 'src/app/core';
import { NamedValue } from 'src/app/core/model/common/named-value';


@Component({
    selector: 'app-project-es-cell-qc',
    templateUrl: './project-es-cell-qc.component.html',
    styleUrls: ['./project-es-cell-qc.component.css'],
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => ProjectEsCellQcComponent),
            multi: true
        },
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ProjectEsCellQcComponent),
            multi: true
        }
    ],
    standalone: false
})
export class ProjectEsCellQcComponent implements OnInit, ControlValueAccessor, Validator {
  @Input() esCellQc: EsCellQc;
  @Input() canUpdate: boolean;

  configurationData: ConfigurationData;
  receivedFromCentres: NamedValue[];
  qcComments: NamedValue[];

  esCellDetailsForm: FormGroup;

  constructor(private configurationDataService: ConfigurationDataService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.loadConfigurationData();
    this.createEsCellDetailsForm();
  }

  loadConfigurationData() {
    this.configurationDataService.getConfigurationData().subscribe(data => {
      this.configurationData = data;
      this.receivedFromCentres = this.configurationData.receivedFromCentres.map(x => ({ name: x }));
      this.qcComments = this.configurationData.qcComments.map(x => ({ name: x }));
    });
  }

  createEsCellDetailsForm() {
    if (this.esCellQc === undefined) {
      this.esCellQc = new EsCellQc();
    }
    this.esCellDetailsForm = this.fb.group({
      numberOfEsCellsReceived: [this.esCellQc.numberOfEsCellsReceived, Validators.pattern('^[0-9]*$')], // number
      esCellsReceivedFromName: [this.esCellQc.esCellsReceivedFromName], // string
      esCellsReceivedOn: [this.esCellQc.esCellsReceivedOn], // Date
      numberOfEsCellsStartingQc: [this.esCellQc.numberOfEsCellsStartingQc, Validators.pattern('^[0-9]*$')], // number
      numberOfEsCellsPassingQc: [this.esCellQc.numberOfEsCellsPassingQc, Validators.pattern('^[0-9]*$')], // number
      esCellQcComment: [this.esCellQc.esCellQcComment] // string
    });
  }

  writeValue(obj: any): void {
    if (obj) {
      this.esCellDetailsForm.setValue(obj, { emitEvent: false });
    }
  }

  onTouched = () => void {};
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // Disable or enable the form control
  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.esCellDetailsForm.disable();
    } else {
      this.esCellDetailsForm.enable();
    }
  }

  // Received a callback, when ever our form value changes it reports the new value to the parent form
  registerOnChange(fn: any): void {
    this.esCellDetailsForm.valueChanges.subscribe(fn);
  }

  validate(c: AbstractControl): ValidationErrors | null {
    return this.esCellDetailsForm.valid ? null : { invalidForm: {valid: false, message: 'escellAttemptForm fields are invalid'} };
  }

}
