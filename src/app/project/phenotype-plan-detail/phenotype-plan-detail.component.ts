import { Component, OnInit, Input } from '@angular/core';
import { PhenotypePlanSummary } from 'src/app/_models/phenotypePlanSummary';

@Component({
  selector: 'app-phenotype-plan-detail',
  templateUrl: './phenotype-plan-detail.component.html',
  styleUrls: ['./phenotype-plan-detail.component.css']
})
export class PhenotypePlanDetailComponent implements OnInit {
  @Input() phenotypePlan: PhenotypePlanSummary;
  constructor() { }

  ngOnInit() {
  }

}
