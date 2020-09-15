import { Component, OnInit } from '@angular/core';
import { Plan } from '../../model/plan';
import { ActivatedRoute, Router } from '@angular/router';
import { PlanService } from '../..';
import { PermissionsService, LoggedUserService, ChangesHistory } from 'src/app/core';
import { ChangeResponse } from 'src/app/core/model/history/change-response';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UpdateNotificationComponent } from '../update-notification/update-notification.component';

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

  changeDetails: ChangesHistory;

  // Content previous modifications so we can tell when something has changed
  originalPlanAsString: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private planService: PlanService,
    private permissionsService: PermissionsService,
    private loggedUserService: LoggedUserService
  ) { }

  ngOnInit() {
    const pin = this.route.snapshot.params.pid;
    this.fetchByPin(pin);
  }

  fetchByPin(pin: string) {
    this.planService.getPlanByPin(pin).subscribe(data => {
      this.plan = data;
      this.originalPlanAsString = JSON.stringify(this.plan);
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
    return this.originalPlanAsString !== JSON.stringify(this.plan);
  }

  onPlanDetailsChange() {
    console.log('To be implemented');
  }

  updatePlan() {
    this.loading = true;
    this.planService.updatePlan(
      this.plan.pin, this.plan).subscribe((changeResponse: ChangeResponse) => {
        this.loading = false;
        this.originalPlanAsString = JSON.stringify(this.plan);
        if (changeResponse && changeResponse.history.length > 0) {
          this.changeDetails = changeResponse.history[0];
          this.snackBar.openFromComponent(UpdateNotificationComponent, {
            duration: 3000,
            data: this.changeDetails
          });
        }
        this.error = null;
        this.router.navigate(['/projects/' + this.plan.tpn + '/plan/' + this.plan.pin]);
      },
        error => {
          console.error('Error while updating plan', error);
          this.error = error;
        }
      );
  }

  onAttemptChanged(e) {
    console.log('To be implemented');
  }

}
