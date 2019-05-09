import { Component, OnInit, Input } from '@angular/core';
import { PhenotypePlan } from 'src/app/_models/project/phenotypePlan';

@Component({
  selector: 'app-phenotype-plan-detail',
  templateUrl: './phenotype-plan-detail.component.html',
  styleUrls: ['./phenotype-plan-detail.component.css']
})
export class PhenotypePlanDetailComponent implements OnInit {
  @Input() phenotypePlan: PhenotypePlan;
  public isCollapsed = true;
  constructor() { }

  ngOnInit() {
  }

}
