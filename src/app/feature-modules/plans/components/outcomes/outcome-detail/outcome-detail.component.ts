import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Outcome } from '../../../model/outcomes/outcome';
import { ActivatedRoute } from '@angular/router';
import { OutcomeService } from '../../../services/outcome.service';
import { PermissionsService, LoggedUserService, ChangesHistory } from 'src/app/core';
import { ChangeResponse } from 'src/app/core/model/history/change-response';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UpdateNotificationComponent } from '../../update-notification/update-notification.component';
import { Project } from 'src/app/model';
import { ProjectService } from 'src/app/feature-modules/projects';

@Component({
  selector: 'app-outcome-detail',
  templateUrl: './outcome-detail.component.html',
  styleUrls: ['./outcome-detail.component.css']
})
export class OutcomeDetailComponent implements OnInit {
  outcome: Outcome = new Outcome();

  outcomeForm: FormGroup;

  project: Project;

  tpo: string;
  pin: string;
  tpn: string;

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
    private projectService: ProjectService,
    private loggedUserService: LoggedUserService) { }

  ngOnInit(): void {
    this.pin = this.route.snapshot.params.pid;
    this.tpo = this.route.snapshot.params.tpo;
    this.tpn = this.route.snapshot.params.id;

    this.loadProject();
    this.reloadOutcome();
    this.outcomeForm = this.formBuilder.group({
      outcomeTypeName: [''],
    });
  }

  reloadOutcome() {
    this.outcomeService.getOutcome(this.pin, this.tpo).subscribe(data => {
      this.outcome = data;
      console.log('this.outcome', this.outcome);

      this.loadMutations();
      this.originalOutcomeAsString = JSON.stringify(this.outcome);
      this.error = null;
      this.evaluateUpdatePermissions();
    }, error => {
      this.error = error;
    });
  }

  loadMutations() {
    this.outcomeService.getMutationsByOutcome(this.pin, this.outcome.tpo).subscribe(data => {
      /* tslint:disable:no-string-literal */
      if (data['_embedded']) {
        this.outcome.mutations = data['_embedded']['mutations'];
        this.outcome.mutations.map(x => x.pin = this.pin);
      }
      /* tslint:enable:no-string-literal */
    }, error => {
      this.error = error;
      console.log(error);
    });
  }

  loadProject() {
    this.projectService.getProject(this.tpn).subscribe(data => {
      console.log('data with', this.tpn, data);

      this.project = data;
    }, error => {
      this.error = error;
      console.log(error);
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
