import { Component, OnInit, Input } from '@angular/core';
import { PhenotypePlanSummary } from 'src/app/_models/phenotypePlanSummary';

@Component({
  selector: 'app-phenotype-plans',
  templateUrl: './phenotype-plans.component.html',
  styleUrls: ['./phenotype-plans.component.css']
})
export class PhenotypePlansComponent implements OnInit {
  @Input() phenotypePlanSummaries: PhenotypePlanSummary[];
  constructor() { }

  ngOnInit() {
    console.log('What the PhenotypePlansComponent has '+ this.phenotypePlanSummaries);
    
  }

}
