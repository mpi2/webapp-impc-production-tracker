import { Component, OnInit, Input } from '@angular/core';
import { PlanDetails } from '../../model/plan-details';

@Component({
  selector: 'app-plan-summary',
  templateUrl: './plan-summary.component.html',
  styleUrls: ['./plan-summary.component.css']
})
export class PlanSummaryComponent implements OnInit {

  @Input() planDetails: PlanDetails;

  constructor() { }

  ngOnInit() {
    console.log('PlanSummaryComponent=>', this.planDetails);
    
  }

}
