import { Component, OnInit, Input } from '@angular/core';
import { PhenotypingAttempt } from '../../../model/phenotyping/phenotyping_attempt';

@Component({
  selector: 'app-phenotyping-attempt',
  templateUrl: './phenotyping-attempt.component.html',
  styleUrls: ['./phenotyping-attempt.component.css']
})
export class PhenotypingAttemptComponent implements OnInit {

  @Input() phenotypingAttempt: PhenotypingAttempt;
  @Input() canUpdatePlan: boolean;;

  constructor() { }

  ngOnInit() {
  }

}
