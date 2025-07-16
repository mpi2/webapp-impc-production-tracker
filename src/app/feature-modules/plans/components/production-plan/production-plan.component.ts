import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PlanService } from '../../services/plan.service';
import { Plan, PlanAdapter } from '../../model/plan';
import { PermissionsService, ChangesHistory, LoggedUserService } from 'src/app/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UpdateNotificationComponent } from '../update-notification/update-notification.component';
import { Project } from 'src/app/model/bio/project';
import { ChangeResponse } from 'src/app/core/model/history/change-response';
import { ProjectService } from 'src/app/feature-modules/projects';
import { Outcome } from '../../model/outcomes/outcome';
import { OutcomeService } from '../../services/outcome.service';
import { CrisprAttempt } from 'src/app/feature-modules/attempts/model/production/crispr/crispr-attempt';


@Component({
    selector: 'app-production-plan',
    templateUrl: './production-plan.component.html',
    styleUrls: ['./production-plan.component.css'],
    standalone: false
})
export class ProductionPlanComponent implements OnInit {

  prodPlanForm: FormGroup;

  plan: Plan = new Plan();
  project: Project = new Project();

  // Content previous modifications so we can tell when something has changed
  originalPlanAsString: string;
  outcomes: Outcome[];
  // crisptAttempt: CrisprAttempt;
  changeDetails: ChangesHistory;

  canUpdatePlan: boolean;
  canAddOutcome: boolean;
  loading = false;
  error: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private planService: PlanService,
    private projectService: ProjectService,
    private outcomeService: OutcomeService,
    private planAdapter: PlanAdapter,
    private permissionsService: PermissionsService,
    private loggedUserService: LoggedUserService) { }

  ngOnInit() {
    const pin = this.route.snapshot.params.pid;
    this.reloadForPin(pin);
    this.prodPlanReactiveForm();
  }

  prodPlanReactiveForm() {
    this.prodPlanForm = this.fb.group({
      planDetails: [null],
      // statusTransitionForm: [''],
      // crisprAttemptForm: [''],
      esCellAttempt: [null],
      esCellAlleleModificationAttempt: [null],
      crisprAlleleModificationAttempt: [null],
      // outcomeForm: ['']
    });
  }

  reloadForPin(pin: string) {
    this.canAddOutcome=true;
    this.planService.getPlanByPin(pin).subscribe(data => {

      this.planService.getCanCreateOutcome(pin).subscribe(result=>{
        this.canAddOutcome=result;
      });

      this.plan = this.planAdapter.adapt(data);
      // eslint-disable-next-line no-underscore-dangle
      const projectUrl = this.plan._links.project.href;
      this.loadProject(projectUrl);
      this.loadOutcomes();
      this.originalPlanAsString = JSON.stringify(this.plan);
      this.error = null;
      this.evaluateUpdatePermissions();
    }, error => {
      this.error = error;
    });
  }

  loadProject(projectUrl: any) {
    this.projectService.getProjectByUrl(projectUrl).subscribe(data => {
      this.project = data;
      this.plan.geneSymbol = this.project.projectIntentions[0].intentionByGene.gene.symbol;
    }, error => {
      this.error = error;
      console.log(error);
    });
  }

  loadOutcomes() {
    this.outcomeService.getOutcomesByPin(this.plan.pin).subscribe(data => {
      if (data['_embedded']) {
        this.outcomes = data['_embedded']['outcomes'];
        this.outcomes.forEach(x => {
          x.tpn = this.plan.tpn;
          this.loadMutationsByOutcomes(x);
        });
      }
    }, error => {
      this.error = error;
      console.log(error);
    });
  }

  loadMutationsByOutcomes(outcome: Outcome) {
    this.outcomeService.getMutationsByPinAndTpn(this.plan.pin, outcome.tpo).subscribe(data => {
      if (data['_embedded']) {
        outcome.mutations = data['_embedded']['mutations'];
      }
    }, error => {
      this.error = error;
      console.log(error);
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

  planHasChanged() {
    return this.originalPlanAsString !== JSON.stringify(this.plan);
  }

  /**
   * Updates the information of the plan.
   */
  update() {
    this.plan = Object.assign(this.plan, this.prodPlanForm.value);
    if (this.planHasChanged()) {
      this.updatePlan();
    } else {
      console.log('Plan has not changed!');
    }
  }

  /**
   * Updates the plan
   */
  private updatePlan() {
    if(this.plan.statusTransition.actionToExecute === 'abandonWhenCreated'){
      delete this.plan.esCellAttempt;
      delete this.plan.esCellAlleleModificationAttempt;
      delete this.plan.crisprAlleleModificationAttempt;
      delete this.plan.crisprAttempt;
    } else if (this.plan.attemptTypeName === 'crispr') {
      delete this.plan.esCellAttempt;
      delete this.plan.esCellAlleleModificationAttempt;
      delete this.plan.crisprAlleleModificationAttempt;
    } else if (this.plan.attemptTypeName === 'es cell') {
      delete this.plan.crisprAttempt;
      delete this.plan.esCellAlleleModificationAttempt;
      delete this.plan.crisprAlleleModificationAttempt;
    } else if (this.plan.attemptTypeName === 'es cell allele modification') {
      delete this.plan.crisprAttempt;
      delete this.plan.esCellAttempt;
      delete this.plan.crisprAlleleModificationAttempt;
    } else if (this.plan.attemptTypeName === 'crispr allele modification') {
      delete this.plan.crisprAttempt;
      delete this.plan.esCellAttempt;
      delete this.plan.esCellAlleleModificationAttempt;
    }
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
        this.reloadForPin(this.plan.pin);
      },
        error => {
          console.error('Error while updating plan', error);
          this.error = error;
        }
      );
  }
}
