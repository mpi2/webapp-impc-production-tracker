import { Component, OnInit, Input } from '@angular/core';
import { PhenotypingAttempt } from '../../../model/phenotyping/phenotyping_attempt';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-phenotyping-attempt',
  templateUrl: './phenotyping-attempt.component.html',
  styleUrls: ['./phenotyping-attempt.component.css']
})
export class PhenotypingAttemptComponent implements OnInit {

  @Input() phenotypingAttempt: PhenotypingAttempt;
  @Input() canUpdatePlan: boolean;
  phenotypingAttemptForm: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.phenotypingAttemptForm = this.formBuilder.group({
    });
  }

  onPhenotypingStarted() {
    console.log('To be implemented');
  }

  onPhenotypingComplete() {
    console.log('To be implemented');
  }

  onNoCountTowardsCompleteness() {
    console.log('To be implemented');
  }

}
