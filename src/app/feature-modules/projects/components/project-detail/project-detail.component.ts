/* eslint-disable no-underscore-dangle */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { Project, ProjectAdapter } from '../../../../model/bio/project';
import { PlanService } from 'src/app/feature-modules/plans';
import { Plan } from 'src/app/feature-modules/plans/model/plan';
import { Outcome } from 'src/app/feature-modules/plans/model/outcomes/outcome';
import {
  ConfigurationData, PermissionsService, ConfigurationDataService,
  LoggedUserService, ChangesHistory
} from 'src/app/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NamedValue } from 'src/app/core/model/common/named-value';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UpdateNotificationComponent } from 'src/app/feature-modules/plans/components/update-notification/update-notification.component';
import { ChangeResponse } from 'src/app/core/model/history/change-response';
import { OutcomeService } from 'src/app/feature-modules/plans/services/outcome.service';


@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit {

  project: Project = new Project();
  originalProjectAsString;
  productionPlansDetails: Plan[] = [];
  phenotypingPlansDetails: Plan[] = [];
  outcomes: Outcome[] = [];
  canUpdateProject: boolean;
  canCreateProductionPlan: boolean;
  canCreatePhenotypingPlan: boolean;
  error;
  changeDetails: ChangesHistory;
  configurationData: ConfigurationData;

  privacies: NamedValue[] = [];
  completionNotes: NamedValue[] = [];
  selectedPrivacy = [];

  projectForm: FormGroup;
  isEsCellProject: boolean;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private projectAdapter: ProjectAdapter,
    private planService: PlanService,
    private permissionsService: PermissionsService,
    private configurationDataService: ConfigurationDataService,
    private loggedUserService: LoggedUserService,
    private outcomeService: OutcomeService,
    private snackBar: MatSnackBar ) { }

  ngOnInit() {
    this.configurationDataService.getConfigurationData().subscribe(data => {
      this.configurationData = data;
      this.privacies = this.configurationData.privacies.map(x => ({ name: x }));
      this.completionNotes = this.configurationData.completionNotes.map(x => ({ name: x }));
    });
    this.projectReactiveForm();
    this.getProjectData();
    this.coloniesExist();

    setTimeout (() => {
      this.isEsCellProject = this.productionPlansDetails.some(plan => plan.attemptTypeName === 'es cell');
    }, 1000);
  }

  showEsCellDetails(): boolean {
    return this.productionPlansDetails.some(plan => plan.attemptTypeName === 'es cell');
  }

  projectReactiveForm() {
    this.projectForm = this.fb.group({
      privacyName: ['', Validators.required],
      recovery: [false],
      comment: [''],
      completionComment: [''],
      completionNote: [''],
      esCellDetails: [null]
    });
  }

  sortByPid(plans: Plan[]): Plan[] {
    plans.sort((a, b) => {
      const nameA = a.pin;
      const nameB = b.pin;
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
    return plans;
  }

  updateProject(): void {
    this.project = Object.assign(this.project, this.projectForm.value);

    console.log('form: ', this.projectForm.value);
    console.log('project: ', this.project);

    this.projectService.updateProject(this.project).subscribe((changeResponse: ChangeResponse) => {
      if (changeResponse && changeResponse.history.length > 0) {
        this.changeDetails = changeResponse.history[0];
        this.snackBar.openFromComponent(UpdateNotificationComponent, {
          duration: 3000,
          data: this.changeDetails
        });
      }
      this.error = null;
    }, error => {
      this.error = error;
    });
  }

  private setFormValues(): void {
    this.projectForm.get('privacyName').setValue(this.project.privacyName);
    this.projectForm.get('comment').setValue(this.project.comment);
    this.projectForm.get('completionComment').setValue(this.project.completionComment);
    this.projectForm.get('completionNote').setValue(this.project.completionNote);
    this.projectForm.get('recovery').setValue(this.project.recovery);
    this.projectForm.get('esCellDetails').setValue(this.project.esCellDetails);
  }

  private coloniesExist(): void {
    this.productionPlansDetails.forEach(plan => {
      this.outcomeService.getOutcomesByPin(plan.pin).subscribe(data => {
        /* eslint-disable @typescript-eslint/dot-notation */
        if (data['_embedded']) {
          this.outcomes.push(data['_embedded']['outcomes']);
        }
        /* eslint-enable @typescript-eslint/dot-notation */
      }, error => {
        this.error = error;
        console.log(error);
      });
    });
    let genotypeConfirmedColonies = 0;
    this.outcomes.forEach(outcome => {
      if (outcome.colony.statusName.localeCompare('Genotype Confirmed')) {
        genotypeConfirmedColonies = genotypeConfirmedColonies + 1;
      }
    });
    if (genotypeConfirmedColonies === 0) {
      this.canCreatePhenotypingPlan = false;
    } else {
      this.loadPermissions();
    }
  }

  private getProjectData(): void {
    const id = this.route.snapshot.params.id;
    this.projectService.getProject(id).subscribe(data => {
      this.project = this.projectAdapter.adapt(data);
      this.originalProjectAsString = JSON.stringify(data);
      this.getProductionPlans();
      this.getPhenotypingPlans();
      this.loadPermissions();
      this.setFormValues();
      this.error = null;
    }, error => {
      this.error = error;
    });
  }

  private loadPermissions(): void {
    if (this.loggedUserService.getLoggerUser()) {
      this.permissionsService.evaluatePermissionByActionOnResource(
        PermissionsService.UPDATE_PROJECT_ACTION, this.project.tpn).subscribe(canUpdateProject => {
          this.canUpdateProject = canUpdateProject;
          this.error = null;
        }, error => {
          this.error = error;
        });
      this.permissionsService.evaluatePermissionByActionOnResource(
        PermissionsService.CREATE_PRODUCTION_PLAN_ACTION, this.project.tpn).subscribe(canCreateProductionPlan => {
          this.canCreateProductionPlan = canCreateProductionPlan;
          this.error = null;
        }, error => {
          this.error = error;
        });
      this.permissionsService.evaluatePermissionByActionOnResource(
        PermissionsService.CREATE_PHENOTYPING_PLAN_ACTION, this.project.tpn).subscribe(canCreatePhenotypingPlan => {
          this.canCreatePhenotypingPlan = canCreatePhenotypingPlan;
          this.error = null;
        }, error => {
          this.error = error;
        });
    } else {
      this.canUpdateProject = false;
      this.canCreateProductionPlan = false;
      this.canCreatePhenotypingPlan = false;
    }
  }

  private getProductionPlans(): void {
    if (this.project._links.productionPlans) {
      this.project._links.productionPlans.map(x => {
        this.planService.getPlanByUrl(x.href).subscribe(plan => {
          this.productionPlansDetails.push(plan);
          this.error = null;
        }, error => {
          this.error = error;
        });
      });
    }
  }

  private getPhenotypingPlans(): void {
    if (this.project._links.phenotypingPlans) {
      this.project._links.phenotypingPlans.map(x => {
        this.planService.getPlanByUrl(x.href).subscribe(plan => {
          this.phenotypingPlansDetails.push(plan);
          this.error = null;
        }, error => {
          this.error = error;
        });
      });
    }
  }
}
