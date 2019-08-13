import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlanService } from '../../services/plan.service';
import { Plan } from '../../model/plan';
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
  canUpdatePlan: boolean;
  planDetailsChanged: boolean = false;
  attemptChanged: boolean = false;
  loading: boolean = false;
  error: string;

  crisptAttempt: CrisprAttempt;

  changeDetails: ChangesHistory;

  constructor(
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private planService: PlanService,
    private permissionsService: PermissionsService) { }

  ngOnInit() {
    let pid = this.route.snapshot.params['pid'];
    this.planService.getPlanByPid(pid).subscribe(data => {
      this.plan = data;
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
        console.log('canUpdatePlan', canUpdatePlan);
        
        this.error = null;
      }, 
      error => {
        this.error = error;
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
      this.plan.pin, this.plan, this.planDetailsChanged, this.attemptChanged).subscribe(
        data => {
          this.loading = false;
          this.planDetailsChanged = false;
          this.attemptChanged = false;

          this.changeDetails = data;
          console.log('data because of change', data);
          
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
