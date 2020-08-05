import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Outcome } from '../../../model/outcomes/outcome';
import { ActivatedRoute } from '@angular/router';
import { OutcomeService } from '../../../services/outcome.service';
import { PermissionsService, LoggedUserService } from 'src/app/core';

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

  constructor(
    private formBuilder: FormBuilder,

    private route: ActivatedRoute,
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

}
