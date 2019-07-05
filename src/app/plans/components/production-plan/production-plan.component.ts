import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlanService } from '../../services/plan.service';
import { Plan, PlanAdapter } from '../../model/plan';

@Component({
  selector: 'app-production-plan',
  templateUrl: './production-plan.component.html',
  styleUrls: ['./production-plan.component.css']
})
export class ProductionPlanComponent implements OnInit {

  plan: Plan;

  constructor(
    private route: ActivatedRoute,
    private planService: PlanService,
    private adapter: PlanAdapter) { }

  ngOnInit() {
    let pid = this.route.snapshot.params['pid'];
    console.log('ProductionPlanComponent.', 'pid:', pid);
    this.planService.getPlanByPid(pid).subscribe(data => {
      this.plan = this.adapter.adapt(data);
      console.log('ProductionPlanComponent =>', this.plan );
    });
  }

}
