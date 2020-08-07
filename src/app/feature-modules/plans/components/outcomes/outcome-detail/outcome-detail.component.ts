import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Outcome } from '../../../model/outcomes/outcome';
import { ActivatedRoute } from '@angular/router';
import { OutcomeService } from '../../../services/outcome.service';
import { PermissionsService, LoggedUserService, ChangesHistory } from 'src/app/core';
import { ChangeResponse } from 'src/app/core/model/history/change-response';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UpdateNotificationComponent } from '../../update-notification/update-notification.component';

@Component({
  selector: 'app-outcome-detail',
  templateUrl: './outcome-detail.component.html',
  styleUrls: ['./outcome-detail.component.css']
})
export class OutcomeDetailComponent implements OnInit {
  outcome: Outcome = new Outcome();

  outcomeForm: FormGroup;

  tpo: string;
  pin: string;

  canUpdate: boolean;
  loading = false;
  error: string;
  originalOutcomeAsString: string;
  changeDetails: ChangesHistory;

  constructor(
    private formBuilder: FormBuilder,

    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private outcomeService: OutcomeService,
    private permissionsService: PermissionsService,
    private loggedUserService: LoggedUserService) { }

  ngOnInit(): void {
    this.pin = this.route.snapshot.params.pid;
    this.tpo = this.route.snapshot.params.tpo;
    this.reloadOutcome();

    this.outcomeForm = this.formBuilder.group({
      outcomeTypeName: [''],
    });
  }

  reloadOutcome() {
    this.outcomeService.getOutcome(this.pin, this.tpo).subscribe(data => {
      console.log('data', data);
      this.outcome = data;
      this.originalOutcomeAsString = JSON.stringify(this.outcome);
      this.error = null;
      this.evaluateUpdatePermissions();
    }, error => {
      this.error = error;
    });
  }

  evaluateUpdatePermissions() {
    if (this.loggedUserService.getLoggerUser()) {
      this.permissionsService.evaluatePermissionByActionOnResource(
        PermissionsService.UPDATE_PLAN_ACTION, this.pin).subscribe(canUpdate => {
          this.canUpdate = canUpdate;
          this.error = null;
        },
          error => {
            this.error = error;
          });
    } else {
      this.canUpdate = false;
    }
  }

  enableUpdateButton() {
    return true;
  }



  update() {
    this.outcomeService.updateOutcome(this.outcome.pin, this.outcome).subscribe((changeResponse: ChangeResponse) => {
      this.loading = false;
      this.originalOutcomeAsString = JSON.stringify(this.outcome);
      if (changeResponse && changeResponse.history.length > 0) {
        this.changeDetails = changeResponse.history[0];
        this.snackBar.openFromComponent(UpdateNotificationComponent, {
          duration: 3000,
          data: this.changeDetails
        });
      }
      this.error = null;
      this.reloadOutcome();
    },
      error => {
        console.error('Error while updating plan outcome', error);
        this.error = error;
      }
    );
  }

}
