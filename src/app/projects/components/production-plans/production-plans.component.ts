import { Component, OnInit, Input } from '@angular/core';
import { ProductionPlan } from 'src/app/projects/model/production_plan/productionPlan';

@Component({
  selector: 'app-production-plans',
  templateUrl: './production-plans.component.html',
  styleUrls: ['./production-plans.component.css']
})
export class ProductionPlansComponent implements OnInit {
  @Input() productionPlans: ProductionPlan[];
  constructor() { }

  ngOnInit() {
    console.log('What the ProductionPlansComponent has:::: ', this.productionPlans);
  }

}
