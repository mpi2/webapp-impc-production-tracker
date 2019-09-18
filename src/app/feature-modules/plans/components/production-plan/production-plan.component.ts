import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlanService } from '../../services/plan.service';
import { Plan, PlanAdapter } from '../../model/plan';
import { PermissionsService, ChangesHistory, ChangesHistoryAdapter } from 'src/app/core';
import { MatSnackBar } from '@angular/material';
import { UpdateNotificationComponent } from '../update-notification/update-notification.component';
import { CrisprAttempt } from 'src/app/feature-modules/attempts';

@Component({
  selector: 'app-production-plan',
  templateUrl: './production-plan.component.html',
  styleUrls: ['./production-plan.component.css']
})
export class ProductionPlanComponent implements OnInit {

  plan: Plan = new Plan();
  originalPlanAsString: string;
  canUpdatePlan: boolean;
  dataChanged: boolean = false;
  loading: boolean = false;
  error: string;

  crisptAttempt: CrisprAttempt;
  changeDetails: ChangesHistory;

  constructor(
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private planService: PlanService,
    private changeHistoryAdapter: ChangesHistoryAdapter,
    private planAdapter: PlanAdapter,
    private permissionsService: PermissionsService) { }

  ngOnInit() {
    let pid = this.route.snapshot.params['pid'];
    this.planService.getPlanByPid(pid).subscribe(data => {
      this.plan = this.planAdapter.adapt(data);
      this.originalPlanAsString = JSON.stringify(this.plan);
      console.log('ProductionPlanComponent =>', this.plan);
      this.evaluateUpdatePermissions()
    }, error => {
      this.error = error;
    });
  }

  evaluateUpdatePermissions() {
    this.permissionsService.evaluatePermissionByActionOnResource(
      PermissionsService.UPDATE_PLAN_ACTION, this.plan.pin).subscribe(canUpdatePlan => {
        this.canUpdatePlan = canUpdatePlan;
        this.error = null;
      },
        error => {
          this.error = error;
        });
  }

  /**
   * Update the plan with the information that each child component changed.
   */
  updatePlan() {
    this.loading = true;

    this.planService.updateProductionPlan(
      this.plan.pin, this.plan).subscribe(
        data => {
          this.loading = false;
          this.originalPlanAsString = JSON.stringify(this.plan);
          this.changeDetails = data;
          this.changeDetails.details.map(x => x.field = this.changeHistoryAdapter.formatPropertyName(x.field));
          this._snackBar.openFromComponent(UpdateNotificationComponent, {
            duration: 3000,
            data: this.changeDetails
          });

        }, error => {
          console.log('Error while updating plan', error);

        }
      );
  }

  planHasChanged() {
    return this.originalPlanAsString != JSON.stringify(this.plan);
  }
}
