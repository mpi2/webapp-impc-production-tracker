import { Component, Input, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormGroup, FormBuilder, Validators, Validator,
  AbstractControl, ValidationErrors, NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { ConfigurationData, ConfigurationDataService } from 'src/app/core';
import { NamedValue } from 'src/app/core/model/common/named-value';
import { InstitutesConsortium, Project } from 'src/app/model';


@Component({
    selector: 'app-project-consortium-institutes',
    templateUrl: './project-consortium-institutes.component.html',
    styleUrls: ['./project-consortium-institutes.component.css'],
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => ProjectConsortiumInstitutesComponent),
            multi: true
        },
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ProjectConsortiumInstitutesComponent),
            multi: true
        }
    ],
    standalone: false
})
export class ProjectConsortiumInstitutesComponent implements OnInit, ControlValueAccessor, Validator {
  @Input() projectConsortia: InstitutesConsortium[];
  @Input() canUpdate: boolean;

  configurationData: ConfigurationData;
  consortia: NamedValue[];
  consortiaForm: FormGroup;
  consortiumNames: string;

  constructor(
    private configurationDataService: ConfigurationDataService,
    private fb: FormBuilder,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadConfigurationData();
    this.consortiaReactiveForm();

    setTimeout (() => {
      this.setListConsortiaNames();
    }, 500);
  }

  setListConsortiaNames(): void {
    if (this.consortia !== null && this.projectConsortia !== undefined) {
      for (const consortium of this.projectConsortia) {
        if (this.consortiumNames === undefined) {
          this.consortiumNames = consortium.consortiumName;
        } else {
          this.consortiumNames += ', ' + consortium.consortiumName;
        }
      }
    }
  }

  consortiaReactiveForm() {
    this.consortiaForm = this.fb.group({
      consortiumName: [[], Validators.required]
    });
  }

  loadConfigurationData() {
    this.configurationDataService.getConfigurationData().subscribe(data => {
      this.configurationData = data;
      this.consortia = this.configurationData.consortia.map(x => ({ name: x }));
    });
  }

  writeValue(obj: any): void {
    if (obj) {
      this.consortiaForm.setValue(obj, { emitEvent: false });
    }
  }

  onTouched = () => void {};
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // Disable or enable the form control
  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.consortiaForm.disable();
    } else {
      this.consortiaForm.enable();
    }
  }

  // Received a callback, when ever our form value changes it reports the new value to the parent form
  registerOnChange(fn: any): void {
    this.consortiaForm.valueChanges.subscribe(fn);
  }

  validate(c: AbstractControl): ValidationErrors | null {
    return this.consortiaForm.valid ? null : { invalidForm: {valid: false, message: 'consortiaForm fields are invalid'} };
  }

}
