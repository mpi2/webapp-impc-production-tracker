import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Outcome} from '../../../model/outcomes/outcome';
import {ActivatedRoute, Router} from '@angular/router';
import {OutcomeService} from '../../../services/outcome.service';
import {
  PermissionsService, LoggedUserService, ChangesHistory,
  ConfigurationDataService, ConfigurationData
} from 'src/app/core';
import {ChangeResponse} from 'src/app/core/model/history/change-response';
import {MatSnackBar} from '@angular/material/snack-bar';
import {UpdateNotificationComponent} from '../../update-notification/update-notification.component';
import {Project} from 'src/app/model';
import {MutationService} from '../../../services/mutation.service';
import {Mutation} from '../../../model/outcomes/mutation';
import {NamedValue} from 'src/app/core/model/common/named-value';
import {Colony} from '../../../model/outcomes/colony';
import {Specimen} from '../../../model/outcomes/specimen';
import {PlanService} from 'src/app/feature-modules/plans';
import {ProjectService} from '../../../../projects';


@Component({
  selector: 'app-outcome-detail',
  templateUrl: './outcome-detail.component.html',
  styleUrls: ['./outcome-detail.component.css']
})
export class OutcomeDetailComponent implements OnInit {
  static staticError: string;
  outcome: Outcome = new Outcome();
  project: Project;

  tpn: string;
  tpo: string;
  pin: string;
  geneSymbol: string;

  canUpdate: boolean;
  loading = false;
  error: string;
  errorMutation: string;

  originalOutcomeAsString: string;
  originalMutationsAsString: string;
  originalSequenceAsString: string;
  originalMutationDeletionsAsString: string;
  originalTargetedExonsAsString: string;


  changeDetails: ChangesHistory;

  tmpIndexRowName = 'tmp_id';
  nextNewId = -1;

  isOutcomeBeingCreated = false;

  mutationsToDelete: Mutation[] = [];
  outcomeTypes: NamedValue[];

  attemptType: string;
  mutations: Mutation[];
  configurationData: ConfigurationData;

  showDeleteButton: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private outcomeService: OutcomeService,
    private mutationService: MutationService,
    private projectService: ProjectService,
    private configurationDataService: ConfigurationDataService,
    private permissionsService: PermissionsService,
    private loggedUserService: LoggedUserService,
    private planService: PlanService) {
  }

  ngOnInit(): void {
    this.error = OutcomeDetailComponent.staticError;
    this.tpn = this.route.snapshot.params.id;
    this.pin = this.route.snapshot.params.pid;
    this.tpo = this.route.snapshot.params.tpo;
    this.showDeleteButton = false;
    this.evaluateUpdatePermissions();
    this.loadConfigurationData();
    this.fetchOrCreateOutcome();
    this.getAttemptType();
  }

  sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  getAttemptType() {
    this.planService.getPlanByPin(this.pin).subscribe(data => {
      this.attemptType = data.attemptTypeName;
      // eslint-disable-next-line no-underscore-dangle
      const projectUrl = data._links.project.href;
      this.loadProject(projectUrl);
    }, error => {
      this.error = error;
    });
  }

  loadProject(projectUrl: any) {
    this.projectService.getProjectByUrl(projectUrl).subscribe(data => {
      this.geneSymbol = data.projectIntentions[0].intentionByGene.gene.symbol;
    }, error => {
      this.error = error;
      console.log(error);
    });
  }

  loadConfigurationData() {
    this.configurationDataService.getConfigurationData().subscribe(data => {
      this.configurationData = data;
      this.outcomeTypes = this.configurationData.outcomeTypes.map(x => ({name: x}));
    });
  }

  evaluateUpdatePermissions() {
    if (this.loggedUserService.getLoggerUser()) {
      this.permissionsService.evaluatePermissionByActionOnResource(
        PermissionsService.UPDATE_PLAN_ACTION, this.pin).subscribe(canUpdate => {
          this.canUpdate = canUpdate;
        },
        error => {
          this.error = error;
        });
    } else {
      this.canUpdate = false;
    }
  }

  setMutations(mutations: Mutation[]) {
    if (mutations) {
      mutations.forEach(x => {
        this.completeDataInMutation(x);
      });
      this.outcome.mutations = mutations.sort((a, b) => a.id - b.id);
      this.originalOutcomeAsString = JSON.stringify(this.outcome);
    }
  }

  completeDataInMutation(mutation: Mutation) {
    mutation.pin = this.pin;
    mutation.tpo = this.tpo;
  }

  enableUpdateButton() {
    const outcomeChanged = this.originalOutcomeAsString !== JSON.stringify(this.outcome) && this.outcome.outcomeTypeName;
    return outcomeChanged;
  }

  updateOrCreate() {
    if (this.isOutcomeBeingCreated) {
      this.create();

    } else {
      this.update();
    }
  }

  create() {
    this.outcomeService.createOutcome(this.outcome.pin, this.outcome).subscribe((changeResponse: ChangeResponse) => {
        this.loading = false;
        this.originalOutcomeAsString = JSON.stringify(this.outcome);
        this.showChangeNotification(changeResponse);
        this.error = null;
        // eslint-disable-next-line no-underscore-dangle
        const link: string = changeResponse._links.self.href;
        const tpo = link.substring(link.lastIndexOf('/') + 1);
        this.reloadForTpo(tpo);

      },
      error => {
        console.error('Error while creating plan outcome', error);
        this.error = error;
        this.loading = false;
      }
    );
  }

  reloadForTpo(tpo: string) {
    this.router.navigate(['/projects/' + this.tpn + '/plans/' + this.pin + '/outcomes/' + tpo]);
  }

  async update() {
    OutcomeDetailComponent.staticError = null;
    this.error = null;
    this.createMutations();
    await this.sleep(1000);
    this.updateMutations();
    await this.sleep(1000);
    this.updateOutcome();
    await this.sleep(2000);
    OutcomeDetailComponent.staticError = this.error;
    this.router.navigateByUrl('/outcome-detail', {skipLocationChange: true}).then(() => {
      this.reloadForTpo(this.tpo);
    });

    // We don't allow to delete mutations at the moment.
    // this.deleteMutations();
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
      let mutationsToUpdate = this.outcome.mutations.filter(x => x.min);
      if (this.originalSequenceAsString !== JSON.stringify(this.outcome.mutations.map(g => g.mutationSequences))) {
        // If true, set molecularMutationDeletions of each mutation to null
        mutationsToUpdate = mutationsToUpdate.map(x => ({
          ...x,
          molecularMutationDeletions: [],
          targetedExons: [],
          isMutationDeletionChecked: false,
          isManualMutationDeletion: false,
        }));
      }

      if (this.originalMutationDeletionsAsString !== JSON.stringify(this.outcome.mutations.map(g => g.molecularMutationDeletions))
        || this.originalTargetedExonsAsString !== JSON.stringify(this.outcome.mutations.map(g => g.targetedExons))) {
        // If true, set molecularMutationDeletions of each mutation to null
        mutationsToUpdate = mutationsToUpdate.map(x => ({
          ...x,
          isManualMutationDeletion: false,
        }));
      }

      mutationsToUpdate.forEach(x => {
        this.mutationService.updateMutation(x).subscribe((changeResponse: ChangeResponse) => {
            this.showChangeNotification(changeResponse);
          },
          error => {
            this.error = error;
            console.log('update min: ', x, error);
          });
      });
    }
  }

  createMutations() {
    if (this.outcome.mutations) {
      const mutationsToCreate = this.outcome.mutations.filter(x => !x.min);

      mutationsToCreate.forEach(x => {
        this.mutationService.createMutation(x).subscribe((changeResponse: ChangeResponse) => {
            this.showChangeNotification(changeResponse);
          },
          error => {
            this.error = error;
            console.log('create min: ', x, this.error);
          });
      });
    }
  }

  deleteMutations() {
    this.mutationsToDelete.forEach(x => {
      this.mutationService.deleteMutation(x).subscribe((changeResponse: ChangeResponse) => {
          this.showChangeNotification(changeResponse);
        },
        error => {
          this.error = error;
          console.log(error);
        });
    });
  }

  onAddMutation() {
    const mutation: Mutation = new Mutation();
    mutation.pin = this.pin;
    mutation.tpo = this.tpo;
    mutation[this.tmpIndexRowName] = this.nextNewId--;
    if (!this.outcome.mutations) {
      this.outcome.mutations = [];
    }
    this.outcome.mutations.push(mutation);
    this.showDeleteButton = true;
  }

  onMutationDeleted(e) {
    this.deleteMutation(e);
    this.mutationsToDelete.push(e);

  }

  // Deletes the mutation in memory
  deleteMutation(mutation: Mutation) {
    if (this.isNewRecord(mutation)) {
      this.outcome.mutations = this.outcome.mutations
        .filter(x => (x[this.tmpIndexRowName] !== mutation[this.tmpIndexRowName]) || x[this.tmpIndexRowName].genes.length !== 0 ||
          (typeof x[this.tmpIndexRowName].symbol !== 'undefined' && x[this.tmpIndexRowName].symbol.length !== 0));
    } else {
      this.outcome.mutations = this.outcome.mutations
        .filter(x => x.min !== mutation.min || x.genes.length !== 0 || (typeof x.symbol !== 'undefined' && x.symbol.length !== 0));
    }
    this.showDeleteMutationButton(mutation);
  }


  showDeleteMutationButton(mutation: Mutation) {

    const mutations = this.outcome.mutations
      .filter(x => x.min === mutation.min && (x.genes.length !== 0 || (typeof x.symbol !== 'undefined' && x.symbol.length !== 0)));
    if (mutations.length !== 0) {
      this.error = 'remove gene and mutation symbol to delete newly created mutations';
    } else {
      this.error = '';
      this.showDeleteButton = false;
    }
  }


  onTypeSelected(e) {
    this.initiOutcomeType(e.value);
  }

  private fetchOrCreateOutcome() {
    if (this.tpo) {
      if (this.pin) {
        this.fetchOutcomeByPinAndTpo();
      } else {
        this.fetchOutcomeByTpo();
      }
    } else {
      this.isOutcomeBeingCreated = true;
      this.outcome = new Outcome();
      this.outcome.tpn = this.tpn;
      this.outcome.pin = this.pin;
    }
  }

  private fetchOutcomeByTpo() {

    this.outcomeService.getOutcomeByTpo(this.tpo).subscribe(data => {
      this.outcome = data;
      this.originalOutcomeAsString = JSON.stringify(this.outcome);
      this.pin = this.outcome.pin;
      // Now that we have a pin we can calculate permissions
      this.evaluateUpdatePermissions();
      this.fetchMutationsByTpo(this.outcome);
    }, error => {
      this.error = error;
    });
  }

  private fetchOutcomeByPinAndTpo() {
    this.outcomeService.getOutcomeByPinAndTpo(this.pin, this.tpo).subscribe(data => {
      this.outcome = data;
      this.originalOutcomeAsString = JSON.stringify(this.outcome);
      this.evaluateUpdatePermissions();
      this.fetchMutationsByPinAndTpo(this.outcome);
    }, error => {
      this.error = error;
    });
  }

  private fetchMutationsByTpo(outcome: Outcome) {
    this.outcomeService.getMutationsByTpn(outcome.tpo).subscribe(data => {
      if (data['_embedded']) {
        const mutations = data['_embedded'].mutations;
        this.originalMutationsAsString = JSON.stringify(mutations);
        this.originalSequenceAsString = JSON.stringify(mutations.map(g => g.mutationSequences))
        this.originalMutationDeletionsAsString = JSON.stringify(mutations.map(g => g.molecularMutationDeletions))
        this.originalTargetedExonsAsString = JSON.stringify(mutations.map(g => g.targetedExons))
        this.setMutations(mutations);
      }
    }, error => {
      this.error = error;
    });
  }

  private fetchMutationsByPinAndTpo(outcome: Outcome) {
    this.outcomeService.getMutationsByPinAndTpn(this.pin, outcome.tpo).subscribe(data => {
      if (data['_embedded']) {
        const mutations = data['_embedded'].mutations;
        this.originalMutationsAsString = JSON.stringify(mutations);
        this.originalSequenceAsString = JSON.stringify(mutations.map(g => g.mutationSequences))
        this.originalMutationDeletionsAsString = JSON.stringify(mutations.map(g => g.molecularMutationDeletions))
        this.originalTargetedExonsAsString = JSON.stringify(mutations.map(g => g.targetedExons))
        this.setMutations(mutations);
      }
    }, error => {
      this.error = error;
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

  private isNewRecord(mutation: Mutation) {
    return mutation.min === null;
  }

  private initiOutcomeType(type: string) {
    if ('Colony' === type) {
      this.outcome.colony = new Colony();
      this.outcome.specimen = null;
    } else if ('Specimen' === type) {
      this.outcome.specimen = new Specimen();
      this.outcome.colony = null;
    }
  }

}
