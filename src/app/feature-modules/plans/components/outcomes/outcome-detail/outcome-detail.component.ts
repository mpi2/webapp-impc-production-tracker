import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Outcome } from '../../../model/outcomes/outcome';
import { ActivatedRoute } from '@angular/router';
import { OutcomeService } from '../../../services/outcome.service';
import { PermissionsService, LoggedUserService, ChangesHistory } from 'src/app/core';
import { ChangeResponse } from 'src/app/core/model/history/change-response';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UpdateNotificationComponent } from '../../update-notification/update-notification.component';
import { Project } from 'src/app/model';
import { MutationService } from '../../../services/mutation.service';
import { Mutation } from '../../../model/outcomes/mutation';

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
  originalMutationsAsString: string;

  changeDetails: ChangesHistory;

  tmpIndexRowName = 'tmp_id';
  nextNewId = -1;

  mutationsToDelete: Mutation[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private outcomeService: OutcomeService,
    private mutationService: MutationService,
    private permissionsService: PermissionsService,
    private loggedUserService: LoggedUserService) { }

  ngOnInit(): void {
    this.pin = this.route.snapshot.params.pid;
    this.tpo = this.route.snapshot.params.tpo;
    this.tpn = this.route.snapshot.params.id;

    this.evaluateUpdatePermissions();
    this.fetchOutcome();
    this.outcomeForm = this.formBuilder.group({
      outcomeTypeName: [''],
    });
  }

  private fetchOutcome() {
    this.outcomeService.getOutcome(this.pin, this.tpo).subscribe(data => {
      this.outcome = data;

      this.fetchMutationsByOutcome(this.outcome);
    }, error => {
      this.error = error;
    });
  }

  private fetchMutationsByOutcome(outcome: Outcome) {
    /* tslint:disable:no-string-literal */
    this.outcomeService.getMutationsByOutcome(this.pin, outcome.tpo).subscribe(data => {
      if (data['_embedded']) {
        const mutations = data['_embedded'].mutations;
        this.originalMutationsAsString = JSON.stringify(mutations);
        this.setMutations(mutations);
      }
    }, error => {
      this.error = error;
    });
    /* tslint:enable:no-string-literal */
  }


  setMutations(mutations: Mutation[]) {
    if (mutations) {
      mutations.forEach(x => {
        this.completeDataInMutation(x);
      });
      this.outcome.mutations = mutations;
      this.originalOutcomeAsString = JSON.stringify(this.outcome);
    }
  }

  completeDataInMutation(mutation: Mutation) {
    mutation.pin = this.pin;
    mutation.tpo = this.tpo;
    mutation.geneSymbolsOrAccessionIds = mutation.genes.map(x => x.symbol);
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
    const outcomeChanged = this.originalOutcomeAsString !== JSON.stringify(this.outcome);
    return outcomeChanged;
  }

  update() {
    this.updateOutcome();
    this.updateMutations();
    this.createMutations();
    this.deleteMutations();
  }

  updateOutcome() {
    if (this.originalOutcomeAsString !== JSON.stringify(this.outcome)) {
      this.loading = true;
      this.outcomeService.updateOutcome(this.outcome.pin, this.outcome).subscribe((changeResponse: ChangeResponse) => {
        this.loading = false;
        this.originalOutcomeAsString = JSON.stringify(this.outcome);
        this.showChangeNotification(changeResponse);
        this.error = null;
      },
        error => {
          console.error('Error while updating plan outcome', error);
          this.error = error;
          this.loading = false;
        }
      );
    }
  }

  updateMutations() {
    if (this.originalMutationsAsString !== JSON.stringify(this.outcome.mutations)) {
      const mutationsToUpdate = this.outcome.mutations.filter(x => x.min);

      mutationsToUpdate.forEach(x => {
        this.mutationService.updateMutation(x).subscribe((changeResponse: ChangeResponse) => {
          this.showChangeNotification(changeResponse);
        },
          error => {
            console.log(error);
          });
      });
    }
  }

  createMutations() {
    const mutationsToCreate = this.outcome.mutations.filter(x => !x.min);

    mutationsToCreate.forEach(x => {
      this.mutationService.createMutation(x).subscribe((changeResponse: ChangeResponse) => {
        this.showChangeNotification(changeResponse);
      },
        error => {
          console.log(error);
        });
    });

  }

  deleteMutations() {
    this.mutationsToDelete.forEach(x => {
      this.mutationService.deleteMutation(x).subscribe((changeResponse: ChangeResponse) => {
        this.showChangeNotification(changeResponse);
      },
        error => {
          console.log(error);
        });
    });
  }

  private showChangeNotification(changeResponse: ChangeResponse) {
    if (changeResponse && changeResponse.history.length > 0) {
      this.changeDetails = changeResponse.history[0];
      this.snackBar.openFromComponent(UpdateNotificationComponent, {
        duration: 3000,
        data: this.changeDetails
      });
    }
  }

  createMutation() {
    const mutation: Mutation = new Mutation();
    mutation.pin = this.pin;
    mutation.tpo = this.tpo;
    mutation[this.tmpIndexRowName] = this.nextNewId--;
    this.outcome.mutations.push(mutation);
  }

  onMutationDeleted(e) {
    this.deleteMutation(e);
    this.mutationsToDelete.push(e);
  }

  // Deletes the mutation in memory
  deleteMutation(mutation: Mutation) {
    if (this.isNewRecord(mutation)) {
      this.outcome.mutations = this.outcome.mutations
        .filter(x => x[this.tmpIndexRowName] !== mutation[this.tmpIndexRowName]);
    } else {
      this.outcome.mutations = this.outcome.mutations
        .filter(x => x.min !== mutation.min);
    }
  }

  private isNewRecord(mutation: Mutation) {
    return mutation.min == null;
  }

}
