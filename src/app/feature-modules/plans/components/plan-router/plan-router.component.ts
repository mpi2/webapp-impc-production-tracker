import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PlanService } from '../..';
import { Plan } from '../../model/plan';

@Component({
  selector: 'app-plan-router',
  templateUrl: './plan-router.component.html',
  styleUrls: ['./plan-router.component.css']
})
export class PlanRouterComponent implements OnInit {
  error;

  constructor(private router: Router, private route: ActivatedRoute, private planService: PlanService) { }

  ngOnInit() {
    const pin = this.route.snapshot.params.pid;
    this.planService.getPlanByPin(pin).subscribe((plan: Plan) => {
      if (plan) {
        if ('production' === plan.typeName) {
          this.router.navigate(['production-plan', plan.pin]);
        } else if ('phenotyping' === plan.typeName) {
          this.router.navigate(['phenotyping-plan', plan.pin]);
        }
      }

    }, error => {
      this.error = error;
    });
  }

}
