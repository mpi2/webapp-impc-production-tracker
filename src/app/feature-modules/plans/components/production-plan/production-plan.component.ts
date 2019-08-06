import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlanService } from '../../services/plan.service';
import { Plan, PlanAdapter } from '../../model/plan';
import { PermissionsService, ChangesHistory, ChangesHistoryAdapter } from 'src/app/core';
import { MatSnackBar } from '@angular/material';
import { UpdateNotificationComponent } from '../update-notification/update-notification.component';


@Component({
  selector: 'app-production-plan',
  templateUrl: './production-plan.component.html',
  styleUrls: ['./production-plan.component.css']
})
export class ProductionPlanComponent implements OnInit {

  plan: Plan = new Plan();
  canUpdatePlan: boolean;
  planDetailsChanged: boolean = false;
  attemptChanged: boolean = false;
  loading: boolean = false;

  changeDetails: ChangesHistory;

  constructor(
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private planService: PlanService,
    private permissionsService: PermissionsService,
    private adapter: PlanAdapter) { }

  ngOnInit() {
    let pid = this.route.snapshot.params['pid'];
    console.log('ProductionPlanComponent.', 'pid:', pid);
    this.planService.getPlanByPid(pid).subscribe(data => {
      this.plan = this.adapter.adapt(data);
      console.log('ProductionPlanComponent =>', this.plan);
      this.evaluateUpdatePermissions()
    });
    console.log('this.plan.planDetails.pin', this.plan.planDetails.pin);
  }

  evaluateUpdatePermissions() {
    this.permissionsService.evaluatePermissionByActionOnResource(
      PermissionsService.UPDATE_PLAN_ACTION, this.plan.planDetails.pin).subscribe(canUpdatePlan => {
        this.canUpdatePlan = canUpdatePlan;
      });
  }

  onPlanDetailsChange(e) {
    this.planDetailsChanged = true;
  }

  onAttemptChanged(e) {
    console.log('Production Plan component notified of change in attempt');
    console.log(e);


    this.attemptChanged = true;
  }

  /**
   * Update the plan with the information that each child component changed.
   */
  updatePlan() {
    this.loading = true;

    this.planService.updateProductionPlan(
      this.plan.planDetails.pin, this.plan, this.planDetailsChanged, this.attemptChanged).subscribe(
        data => {
          this.loading = false;
          this.planDetailsChanged = false;
          this.attemptChanged = false;

          this.changeDetails = data;
          this.changeDetails.details.map(x => x.field = ChangesHistoryAdapter.formatPropertyName(x.field));
          console.log('updated:', this.changeDetails);

          this._snackBar.openFromComponent(UpdateNotificationComponent, {
            duration: 3000,
            data: this.changeDetails
          });

        }, error => {
          console.log('Error while updating plan', error);

        }
      );
  }

  shouldShowUpdateButton() {
    // console.log('shouldShowUpdateButton',!this.loading && (this.planDetailsChanged || this.attemptChanged));
    // console.log('this.loading', this.loading);
    // console.log('this.planDetailsChanged', this.planDetailsChanged);
    // console.log('this.attemptChanged', this.attemptChanged);

    return !this.loading && (this.planDetailsChanged || this.attemptChanged)
  }
}
