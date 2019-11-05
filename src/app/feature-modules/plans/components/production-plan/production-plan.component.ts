import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlanService } from '../../services/plan.service';
import { Plan, PlanAdapter } from '../../model/plan';
import { PermissionsService, ChangesHistory, ChangesHistoryAdapter, LoggedUserService } from 'src/app/core';
import { MatSnackBar } from '@angular/material';
import { UpdateNotificationComponent } from '../update-notification/update-notification.component';
import { CrisprAttempt } from 'src/app/feature-modules/attempts';
import { Project } from 'src/app/model/bio/project';

@Component({
  selector: 'app-production-plan',
  templateUrl: './production-plan.component.html',
  styleUrls: ['./production-plan.component.css']
})
export class ProductionPlanComponent implements OnInit {

  plan: Plan = new Plan();
  project: Project = new Project();

  originalPlanAsString: string;
  canUpdatePlan: boolean;
  dataChanged = false;
  loading = false;
  error: string;

  crisptAttempt: CrisprAttempt;
  changeDetails: ChangesHistory;

  constructor(
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private planService: PlanService,
    private changeHistoryAdapter: ChangesHistoryAdapter,
    private planAdapter: PlanAdapter,
    private permissionsService: PermissionsService,
    private loggedUserService: LoggedUserService) { }

  ngOnInit() {
    const pin = this.route.snapshot.params.pid;
    this.reloadForPin(pin);
  }

  reloadForPin(pin: string) {
    this.planService.getPlanByPin(pin).subscribe(data => {
      this.plan = this.planAdapter.adapt(data);
      this.originalPlanAsString = JSON.stringify(this.plan);
      console.log('ProductionPlanComponent =>', this.plan);

      this.error = null;
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

  /**
   * Update the plan with the information that each child component changed.
   */
  updatePlan() {
    console.log('Plan to update', this.plan);

    this.loading = true;
    this.planService.updateProductionPlan(
      this.plan.pin, this.plan).subscribe(
        data => {
          this.loading = false;
          this.originalPlanAsString = JSON.stringify(this.plan);
          this.changeDetails = data;
          this.changeDetails.details.map(x => x.field = this.changeHistoryAdapter.formatPropertyName(x.field));
          this.snackBar.openFromComponent(UpdateNotificationComponent, {
            duration: 3000,
            data: this.changeDetails
          });
          this.error = null;
          this.reloadForPin(this.plan.pin);
        }, error => {
          console.log('Error while updating plan', error);
          this.error = error;

        }
      );
  }

  planHasChanged() {
    return this.originalPlanAsString !== JSON.stringify(this.plan);
  }
}
