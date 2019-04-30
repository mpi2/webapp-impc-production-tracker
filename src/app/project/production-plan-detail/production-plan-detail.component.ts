import { Component, OnInit, Input } from '@angular/core';
import { ProductionPlanSummary } from 'src/app/_models/productionPlanSummary';

@Component({
  selector: 'app-production-plan-detail',
  templateUrl: './production-plan-detail.component.html',
  styleUrls: ['./production-plan-detail.component.css']
})
export class ProductionPlanDetailComponent implements OnInit {
  @Input() productionPlan: ProductionPlanSummary;
  constructor() { }

  ngOnInit() {
  }

}
