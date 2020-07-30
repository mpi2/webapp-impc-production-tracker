import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Outcome } from '../../../model/outcomes/outcome';

@Component({
  selector: 'app-outcome-detail',
  templateUrl: './outcome-detail.component.html',
  styleUrls: ['./outcome-detail.component.css']
})
export class OutcomeDetailComponent implements OnInit {
  @Input() outcome: Outcome;

  outcomeForm: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    console.log('outcome==>', this.outcome);

    this.outcomeForm = this.formBuilder.group({
      outcomeTypeName: [''],
    });
  }

}
