import { Component, OnInit, Input } from '@angular/core';
import { ProductionPlan } from 'src/app/_models/project/production_plan/productionPlan';

@Component({
  selector: 'app-production-plan-detail',
  templateUrl: './production-plan-detail.component.html',
  styleUrls: ['./production-plan-detail.component.css']
})
export class ProductionPlanDetailComponent implements OnInit {
  @Input() productionPlan: ProductionPlan;
  public isCollapsed = true;

  constructor() { }

  ngOnInit() {
    console.log('<<productionPlan in class ProductionPlanDetailComponent>>:: ',this.productionPlan);
    
  }

}
