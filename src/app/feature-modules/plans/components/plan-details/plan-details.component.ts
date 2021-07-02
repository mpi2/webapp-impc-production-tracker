import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormGroup, FormBuilder, NG_VALUE_ACCESSOR } from '@angular/forms';
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
  ]
})

export class PlanDetailsComponent implements OnInit, ControlValueAccessor {

  @Input() plan: Plan;
  @Input() canUpdatePlan: boolean;

  planDetailsForm: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.createPlanDetailsForm();

    setTimeout (() => {
      this.planDetailsForm.get('comment').setValue(this.plan.comment);
    }, 1000);
  }

  createPlanDetailsForm() {
    this.planDetailsForm = this.fb.group({
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

  onCommentChange(comment: string): void {
    this.plan.comment = comment;
  }

  // Received a callback, when ever our form value changes it reports the new value to the parent form
  registerOnChange(fn: any): void {
    this.planDetailsForm.valueChanges.subscribe(fn);
  }
}
