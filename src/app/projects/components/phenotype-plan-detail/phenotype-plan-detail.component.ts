import { Component, OnInit, Input } from '@angular/core';
import { PhenotypePlan } from 'src/app/projects/model/phenotype_plan/phenotypePlan';

@Component({
  selector: 'app-phenotype-plan-detail',
  templateUrl: './phenotype-plan-detail.component.html',
  styleUrls: ['./phenotype-plan-detail.component.css']
})
export class PhenotypePlanDetailComponent implements OnInit {
  @Input() phenotypePlan: PhenotypePlan;
  isCollapsed = true;
  collapseButtonText = 'See more...';

  constructor() { }

  ngOnInit() {
    console.log('Input for PhenotypePlanDetailComponent: ', this.phenotypePlan);
    
  }

  onCollapsed() {
    this.isCollapsed = !this.isCollapsed;
    if (this.isCollapsed) {
      this.collapseButtonText = 'See more...';
    } else {
      this.collapseButtonText = 'See less...';
    }
  }

}
