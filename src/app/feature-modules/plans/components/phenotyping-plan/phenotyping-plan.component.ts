import { Component, OnInit } from '@angular/core';
import { Plan } from '../../model/plan';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { PlanService } from '../..';
import { PermissionsService } from 'src/app/core';

@Component({
  selector: 'app-phenotyping-plan',
  templateUrl: './phenotyping-plan.component.html',
  styleUrls: ['./phenotyping-plan.component.css']
})
export class PhenotypingPlanComponent implements OnInit {

  plan: Plan = new Plan();
  canUpdatePlan: boolean;
  planDetailsChanged: boolean = false;
  attemptChanged: boolean = false;
  loading: boolean = false;
  error: string;

  constructor(
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private planService: PlanService,
    private permissionsService: PermissionsService
  ) { }

  ngOnInit() {
    let pid = this.route.snapshot.params['pid'];
    this.planService.getPlanByPid(pid).subscribe(data => {
      this.plan = data;
      console.log('PhenotypingPlanComponent =>', this.plan);
      this.evaluateUpdatePermissions()
    }, error => {
      this.error = error;
    });
  }

  evaluateUpdatePermissions() {
    this.permissionsService.evaluatePermissionByActionOnResource(
      PermissionsService.UPDATE_PLAN_ACTION, this.plan.pin).subscribe(canUpdatePlan => {
        this.canUpdatePlan = canUpdatePlan;
        console.log('canUpdatePlan', canUpdatePlan);

        this.error = null;
      },
        error => {
          this.error = error;
        });
  }

  shouldShowUpdateButton() {
    return !this.loading && (this.planDetailsChanged || this.attemptChanged)
  }

}
