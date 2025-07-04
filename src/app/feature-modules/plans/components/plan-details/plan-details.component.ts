import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormGroup, FormBuilder, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ConfigurationDataService, ConfigurationData, LoggedUserService } from 'src/app/core';
import { NamedValue } from 'src/app/core/model/common/named-value';
import { Plan } from '../../model/plan';


@Component({
    selector: 'app-plan-details',
    templateUrl: './plan-details.component.html',
    styleUrls: ['./plan-details.component.css'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => PlanDetailsComponent),
            multi: true
        }
    ],
    standalone: false
})

export class PlanDetailsComponent implements OnInit, ControlValueAccessor {

  @Input() plan: Plan;
  @Input() canUpdatePlan: boolean;

  planDetailsForm: FormGroup;
  configurationData: ConfigurationData;
  filteredFundersByWorkGroup: NamedValue[] = [];
  fundersByWorkGroups = new Map<string, NamedValue[]>();

  constructor(private fb: FormBuilder,
              private configurationDataService: ConfigurationDataService) { }

  ngOnInit() {
    this.createPlanDetailsForm();

    this.configurationDataService.getConfigurationData().subscribe(data => {
      this.configurationData = data;
      Object.keys(this.configurationData.fundersByWorkGroups).map(key => {
        const list = this.configurationData.fundersByWorkGroups[key];
        this.fundersByWorkGroups.set(key, list.map(x => ({ name: x })));
      });
    }, error => {
      console.log('error => ', error);
    });

    setTimeout (() => {
      this.planDetailsForm.get('comment').setValue(this.plan.comment);
      this.planDetailsForm.get('funderNames').setValue(this.plan.funderNames);
      this.filteredFundersByWorkGroup = this.fundersByWorkGroups.get(this.plan.workGroupName);
    }, 1000);
  }

  createPlanDetailsForm() {
    this.planDetailsForm = this.fb.group({
      funderNames: [this.plan.funderNames],
      comment: [this.plan.comment]
    });
  }

  onTouched = () => void {}; // initialize it with an empty function

  writeValue(obj: any): void {
    if (obj) {
      this.planDetailsForm.patchValue(obj, { emitEvent: false });
    }
  }

  // When we want to report that this form is being touched by the user. Meaning, that the user has tried to interact with the form somehow.
  // It received a function.
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // Disable or enable the form control
  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.planDetailsForm.disable();
    } else {
      this.planDetailsForm.enable();
    }
  }

  fundersChanged(e): void {
    if (e.value !== null) {
      this.plan.funderNames = e.value;
    }
  }

  onCommentChange(comment: string): void {
    this.plan.comment = comment;
  }

  // Received a callback, when ever our form value changes it reports the new value to the parent form
  registerOnChange(fn: any): void {
    this.planDetailsForm.valueChanges.subscribe(fn);
  }
}
