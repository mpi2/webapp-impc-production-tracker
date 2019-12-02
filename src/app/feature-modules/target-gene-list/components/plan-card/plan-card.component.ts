import { Component, OnInit, Input } from '@angular/core';
import { PlanSummary } from 'src/app/model/bio/target_gene_list/project-by-target-gene-summary';

@Component({
  selector: 'app-plan-card',
  templateUrl: './plan-card.component.html',
  styleUrls: ['./plan-card.component.css']
})
export class PlanCardComponent implements OnInit {
  @Input() plan: PlanSummary;

  constructor() { }

  ngOnInit() {
  }

}
