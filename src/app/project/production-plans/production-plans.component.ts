import { Component, OnInit, Input } from '@angular/core';
import { ProductionPlanSummary } from 'src/app/_models/productionPlanSummary';

@Component({
  selector: 'app-production-plans',
  templateUrl: './production-plans.component.html',
  styleUrls: ['./production-plans.component.css']
})
export class ProductionPlansComponent implements OnInit {
  @Input() productionPlanSummaries: ProductionPlanSummary[];
  constructor() { }

  ngOnInit() {
  }

}
