import { Component, OnInit, Input } from '@angular/core';
import { Plan } from '../../model/plan';

@Component({
  selector: 'app-plan-summary',
  templateUrl: './plan-summary.component.html',
  styleUrls: ['./plan-summary.component.css']
})
export class PlanSummaryComponent implements OnInit {

  @Input() plan: Plan;

  constructor() { }

  ngOnInit() {
    console.log('PlanSummaryComponent=>', this.plan);
    
  }

}
