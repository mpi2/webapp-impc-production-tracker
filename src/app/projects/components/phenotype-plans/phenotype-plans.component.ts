import { Component, OnInit, Input } from '@angular/core';
import { PhenotypePlan } from 'src/app/projects/model/phenotype_plan/phenotype-plan';

@Component({
  selector: 'app-phenotype-plans',
  templateUrl: './phenotype-plans.component.html',
  styleUrls: ['./phenotype-plans.component.css']
})
export class PhenotypePlansComponent implements OnInit {
  @Input() phenotypePlans: PhenotypePlan[];
  constructor() { }

  ngOnInit() {
    console.log('What the PhenotypePlansComponent has:::: ', this.phenotypePlans);
  }

}
