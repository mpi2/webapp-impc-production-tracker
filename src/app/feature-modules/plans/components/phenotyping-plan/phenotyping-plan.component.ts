import { Component, OnInit } from '@angular/core';
import { Plan } from '../../model/plan';
import { ActivatedRoute } from '@angular/router';
import { PlanService } from '../..';
import { PermissionsService, LoggedUserService } from 'src/app/core';

@Component({
  selector: 'app-phenotyping-plan',
  templateUrl: './phenotyping-plan.component.html',
  styleUrls: ['./phenotyping-plan.component.css']
})
export class PhenotypingPlanComponent implements OnInit {

  plan: Plan = new Plan();
  canUpdatePlan: boolean;
  planDetailsChanged = false;
  attemptChanged = false;
  loading = false;
  error: string;

  constructor(
    private route: ActivatedRoute,
    private planService: PlanService,
    private permissionsService: PermissionsService,
    private loggedUserService: LoggedUserService
  ) { }

  ngOnInit() {
    const pin = this.route.snapshot.params.pid;
    this.planService.getPlanByPin(pin).subscribe(data => {
      this.plan = data;
      console.log('PhenotypingPlanComponent =>', this.plan);
      this.evaluateUpdatePermissions();
    }, error => {
      this.error = error;
    });
  }

  evaluateUpdatePermissions() {
    if (this.loggedUserService.getLoggerUser()) {
      this.permissionsService.evaluatePermissionByActionOnResource(
        PermissionsService.UPDATE_PLAN_ACTION, this.plan.pin).subscribe(canUpdatePlan => {
          this.canUpdatePlan = canUpdatePlan;
          this.error = null;
        },
          error => {
            this.error = error;
          });
    } else {
      this.canUpdatePlan = false;
    }
  }

  shouldShowUpdateButton() {
    return !this.loading && (this.planDetailsChanged || this.attemptChanged);
  }

  onPlanDetailsChange() {
    console.log('To be implemented');
  }

  updatePlan() {
    console.log('To be implemented');
  }

  onAttemptChanged(e) {
    console.log('To be implemented');
  }

}
