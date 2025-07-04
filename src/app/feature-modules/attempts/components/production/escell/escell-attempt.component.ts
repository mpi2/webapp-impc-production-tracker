import { Component, Input, OnInit, forwardRef, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormGroup, FormBuilder, Validators, Validator,
  AbstractControl, ValidationErrors, NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';

import { EsCellAttempt } from '../../../model/production/escell/escell-attempt';
import { ConfigurationDataService, ConfigurationData } from 'src/app/core';
import { NamedValue } from 'src/app/core/model/common/named-value';
import { EsCellDialogBoxComponent } from './es-cell-dialog-box/es-cell-dialog-box.component';


@Component({
    selector: 'app-escell-attempt',
    templateUrl: './escell-attempt.component.html',
    styleUrls: ['./escell-attempt.component.css'],
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => EscellAttemptComponent),
            multi: true
        },
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => EscellAttemptComponent),
            multi: true
        }
    ],
    standalone: false
})
export class EscellAttemptComponent implements OnInit, ControlValueAccessor, Validator {
  @Input() esCellAttempt: EsCellAttempt;
  @Input() canUpdatePlan: boolean;
  @ViewChild('esCellNameTable') esCellNameTable: MatTable<any>;

  blastStrains: NamedValue[];
  testCrossStrains: NamedValue[];
  configurationData: ConfigurationData;
  esCellAttemptForm: FormGroup;

  emptyString: string;
  action: string;

  constructor(private configurationDataService: ConfigurationDataService,
              private fb: FormBuilder,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadConfigurationData();
    this.createEsCellAttemptForm();
    this.emptyString = ' ';
  }

  createEsCellAttemptForm() {
    this.esCellAttemptForm = this.fb.group({
      esCellName: [this.esCellAttempt.esCellName, Validators.required],
      miDate: [this.esCellAttempt.miDate], // date
      attemptExternalRef: [this.esCellAttempt.attemptExternalRef, Validators.required], // string
      experimental: [this.esCellAttempt.experimental], // boolean
      imitsMiAttemptId: [this.esCellAttempt.imitsMiAttemptId],
      comment: [this.esCellAttempt.comment],
      blastStrainName: [this.esCellAttempt.blastStrainName], // string
      totalBlastsInjected: [this.esCellAttempt.totalBlastsInjected,
                                  Validators.pattern('^[0-9]*$')], // number;
      totalTransferred: [this.esCellAttempt.totalTransferred, Validators.pattern('^[0-9]*$')], // number;
      numberSurrogatesReceiving: [this.esCellAttempt.numberSurrogatesReceiving, Validators.pattern('^[0-9]*$')], // number;
      totalPupsBorn: [this.esCellAttempt.totalPupsBorn, Validators.pattern('^[0-9]*$')], // number;
      totalFemaleChimeras: [this.esCellAttempt.totalFemaleChimeras, Validators.pattern('^[0-9]*$')], // number;
      totalMaleChimeras: [this.esCellAttempt.totalMaleChimeras, Validators.pattern('^[0-9]*$')], // number;
      numberOfMalesWith0To39PercentChimerism: [this.esCellAttempt.numberOfMalesWith0To39PercentChimerism,
                                                  Validators.pattern('^[0-9]*$')], // number;
      numberOfMalesWith40To79PercentChimerism: [this.esCellAttempt.numberOfMalesWith40To79PercentChimerism,
                                                  Validators.pattern('^[0-9]*$')], // number;
      numberOfMalesWith80To99PercentChimerism: [this.esCellAttempt.numberOfMalesWith80To99PercentChimerism,
                                                  Validators.pattern('^[0-9]*$')], // number;
      numberOfMalesWith100PercentChimerism: [this.esCellAttempt.numberOfMalesWith100PercentChimerism,
                                                  Validators.pattern('^[0-9]*$')], // number;
      testCrossStrainName: [this.esCellAttempt.testCrossStrainName], // string;
      dateChimerasMated: [this.esCellAttempt.dateChimerasMated], // Date;
      numberOfChimeraMatingsAttempted: [this.esCellAttempt.numberOfChimeraMatingsAttempted, Validators.pattern('^[0-9]*$')], // number;
      numberOfChimeraMatingsSuccessful: [this.esCellAttempt.numberOfChimeraMatingsSuccessful, Validators.pattern('^[0-9]*$')], // number;
      numberOfChimerasWithGltFromCct: [this.esCellAttempt.numberOfChimerasWithGltFromCct, Validators.pattern('^[0-9]*$')], // number;
      numberOfChimerasWithGltFromGenotyping: [this.esCellAttempt.numberOfChimerasWithGltFromGenotyping,
                                                  Validators.pattern('^[0-9]*$')], // number;
      numberOfChimerasWith0To9PercentGlt: [this.esCellAttempt.numberOfChimerasWith0To9PercentGlt,
                                                  Validators.pattern('^[0-9]*$')], // number;
      numberOfChimerasWith10To49PercentGlt: [this.esCellAttempt.numberOfChimerasWith10To49PercentGlt,
                                                  Validators.pattern('^[0-9]*$')], // number;
      numberOfChimerasWith50To99PercentGlt: [this.esCellAttempt.numberOfChimerasWith50To99PercentGlt,
                                                  Validators.pattern('^[0-9]*$')], // number;
      numberOfChimerasWith100PercentGlt: [this.esCellAttempt.numberOfMalesWith100PercentChimerism,
                                                  Validators.pattern('^[0-9]*$')], // number;
      totalF1MiceFromMatings: [this.esCellAttempt.totalF1MiceFromMatings, Validators.pattern('^[0-9]*$')], // number;
      numberOfCctOffspring: [this.esCellAttempt.numberOfCctOffspring, Validators.pattern('^[0-9]*$')], // number;
      cassetteTransmissionVerified: [this.esCellAttempt.cassetteTransmissionVerified], // Date;
      numberOfHetOffspring: [this.esCellAttempt.numberOfHetOffspring, Validators.pattern('^[0-9]*$')], // number;
      numberOfLiveGltOffspring: [this.esCellAttempt.numberOfLiveGltOffspring, Validators.pattern('^[0-9]*$')], // number;
    });
  }

  loadConfigurationData() {
    this.configurationDataService.getConfigurationData().subscribe(data => {
      this.configurationData = data;
      this.blastStrains = this.configurationData.blastStrains.map(x => ({ name: x }));
      this.testCrossStrains = this.configurationData.testCrossStrains.map(x => ({ name: x }));
    });
  }

  onMiDateChanged() {
    if (this.esCellAttemptForm.get('miDate').value != null) {
      const miDate = this.esCellAttemptForm.get('miDate').value;
      this.esCellAttempt.miDate = miDate.toISOString();
    } else {
      this.esCellAttempt.miDate = null;
    }
  }

  onAttemptExternalRefChange() {
    this.esCellAttempt.attemptExternalRef = this.esCellAttemptForm.get('attemptExternalRef').value;
  }

  onExperimentalChange() {
    this.esCellAttempt.experimental  = this.esCellAttemptForm.get('experimental').value;
  }

  onCommentChange() {
    this.esCellAttempt.comment  = this.esCellAttemptForm.get('comment').value;
  }

  onBlastStrainNameChange() {
    this.esCellAttempt.blastStrainName  = this.esCellAttemptForm.get('blastStrainName').value;
  }

  onTotalBlastsInjectedChange() {
    this.esCellAttempt.totalBlastsInjected  = this.esCellAttemptForm.get('totalBlastsInjected').value;
  }

  onTotalTransferredChange() {
    this.esCellAttempt.totalTransferred  = this.esCellAttemptForm.get('totalTransferred').value;
  }

  onNumberSurrogatesReceivingChange() {
    this.esCellAttempt.numberSurrogatesReceiving  = this.esCellAttemptForm.get('numberSurrogatesReceiving').value;
  }

  onTotalPupsBornChange() {
    this.esCellAttempt.totalPupsBorn  = this.esCellAttemptForm.get('totalPupsBorn').value;
  }

  onTotalFemaleChimerasChange() {
    this.esCellAttempt.totalFemaleChimeras  = this.esCellAttemptForm.get('totalFemaleChimeras').value;
  }

  onTotalMaleChimerasChange() {
    this.esCellAttempt.totalMaleChimeras  = this.esCellAttemptForm.get('totalMaleChimeras').value;
  }

  onNumberOfMalesWith0To39PercentChimerismChange() {
    this.esCellAttempt.numberOfMalesWith0To39PercentChimerism  = this.esCellAttemptForm.get('numberOfMalesWith0To39PercentChimerism').value;
  }

  onNumberOfMalesWith40To79PercentChimerismChange() {
    this.esCellAttempt.numberOfMalesWith40To79PercentChimerism  = this.esCellAttemptForm.
                                                                      get('numberOfMalesWith40To79PercentChimerism').value;
  }

  onNumberOfMalesWith80To99PercentChimerismChange() {
    this.esCellAttempt.numberOfMalesWith80To99PercentChimerism  = this.esCellAttemptForm.
                                                                      get('numberOfMalesWith80To99PercentChimerism').value;
  }

  onNumberOfMalesWith100PercentChimerismChange() {
    this.esCellAttempt.numberOfMalesWith100PercentChimerism  = this.esCellAttemptForm.
                                                                      get('numberOfMalesWith100PercentChimerism').value;
  }

  onTestCrossStrainNameChange() {
    this.esCellAttempt.testCrossStrainName  = this.esCellAttemptForm.get('testCrossStrainName').value;
  }

  onMatingDateChanged() {
    if (this.esCellAttemptForm.get('dateChimerasMated').value != null) {
      const dateChimerasMated = this.esCellAttemptForm.get('dateChimerasMated').value;
      this.esCellAttempt.dateChimerasMated = dateChimerasMated.toISOString();
    } else {
      this.esCellAttempt.dateChimerasMated = null;
    }
  }

  onNumberOfChimeraMatingsAttemptedChange() {
    this.esCellAttempt.numberOfChimeraMatingsAttempted  = this.esCellAttemptForm.get('numberOfChimeraMatingsAttempted').value;
  }

  onNumberOfChimeraMatingsSuccessfulChange() {
    this.esCellAttempt.numberOfChimeraMatingsSuccessful  = this.esCellAttemptForm.get('numberOfChimeraMatingsSuccessful').value;
  }

  onNumberOfChimeraWithGltFromCctChange() {
    this.esCellAttempt.numberOfChimerasWithGltFromCct  = this.esCellAttemptForm.get('numberOfChimerasWithGltFromCct').value;
  }

  onNumberOfChimeraWithGltFromGenotypingChange() {
    this.esCellAttempt.numberOfChimerasWithGltFromGenotyping  = this.esCellAttemptForm.get('numberOfChimerasWithGltFromGenotyping').value;
  }

  onNumberOfChimeraWith0To9PercentGltChange() {
    this.esCellAttempt.numberOfChimerasWith0To9PercentGlt  = this.esCellAttemptForm.get('numberOfChimerasWith0To9PercentGlt').value;
  }

  onNumberOfChimeraWith10To49PercentGltChange() {
    this.esCellAttempt.numberOfChimerasWith10To49PercentGlt  = this.esCellAttemptForm.get('numberOfChimerasWith10To49PercentGlt').value;
  }

  onNumberOfChimeraWith50To99PercentGltChange() {
    this.esCellAttempt.numberOfChimerasWith50To99PercentGlt = this.esCellAttemptForm.get('numberOfChimerasWith50To99PercentGlt').value;
  }

  onNumberOfChimeraWith100PercentGltChange() {
    this.esCellAttempt.numberOfChimerasWith100PercentGlt = this.esCellAttemptForm.get('numberOfChimerasWith100PercentGlt').value;
  }

  onTotalF1MiceFromMatingsChange() {
    this.esCellAttempt.totalF1MiceFromMatings = this.esCellAttemptForm.get('totalF1MiceFromMatings').value;
  }

  onNumberOfCctOffspringChange() {
    this.esCellAttempt.numberOfCctOffspring = this.esCellAttemptForm.get('numberOfCctOffspring').value;
  }

  onCassetteTransmissionChanged() {
    if (this.esCellAttemptForm.get('cassetteTransmissionVerified').value != null) {
      const cassetteTransmissionVerified = this.esCellAttemptForm.get('cassetteTransmissionVerified').value;
      this.esCellAttempt.cassetteTransmissionVerified = cassetteTransmissionVerified.toISOString();
    } else {
      this.esCellAttempt.cassetteTransmissionVerified = null;
    }
  }

  onNumberOfHetOffspringChange() {
    this.esCellAttempt.numberOfHetOffspring = this.esCellAttemptForm.get('numberOfHetOffspring').value;
  }

  onNumberOfLiveGltOffspringChange() {
    this.esCellAttempt.numberOfLiveGltOffspring = this.esCellAttemptForm.get('numberOfLiveGltOffspring').value;
  }

  openDialog(action, obj) {
    obj.action = action;
    const dialogRef = this.dialog.open(EsCellDialogBoxComponent, {
      width: '600px',
      data: obj
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.event === 'Add'){
        this.addEsCellData(result.data);
      }
    });
  }

  addEsCellData(rowObj){
    this.esCellAttemptForm.get('esCellName').setValue(rowObj.name);
    // this.esCellAttempt.esCellName = rowObj.name;
  }

  writeValue(obj: any): void {
    if (obj) {
      this.esCellAttemptForm.setValue(obj, { emitEvent: false });
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
      this.esCellAttemptForm.disable();
    } else {
      this.esCellAttemptForm.enable();
    }
  }

  // Received a callback, when ever our form value changes it reports the new value to the parent form
  // registers 'fn' that will be fired when changes are made
  // this is how we emit the changes back to the form
  registerOnChange(fn: any): void {
    this.esCellAttemptForm.valueChanges.subscribe(fn);
  }

  validate(c: AbstractControl): ValidationErrors | null {
    return this.esCellAttemptForm.valid ? null : { invalidForm: {valid: false, message: 'escellAttemptForm fields are invalid'} };
  }

}
