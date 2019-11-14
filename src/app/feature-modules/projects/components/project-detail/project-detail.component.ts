import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { Project, ProjectAdapter } from '../../../../model/bio/project';
import { PlanService } from 'src/app/feature-modules/plans';
import { Plan } from 'src/app/feature-modules/plans/model/plan';
import { ConfigurationData, PermissionsService, ConfigurationDataService, LoggedUserService } from 'src/app/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProjectIntention } from 'src/app/model/bio/project-intention';
import { UserService } from 'src/app/core/services/user.service';

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
  canUpdateProject: boolean;
  error;

  assignmentStatusDatesColumns = ['name', 'date'];

  configurationData: ConfigurationData;

  privacies: NamedValue[] = [];
  selectedPrivacy = [];

  projectIntentionsByGene: ProjectIntention[] = [];
  projectIntentionsByLocation: ProjectIntention[] = [];
  projectIntentionsBySequence: ProjectIntention[] = [];

  projectForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private projectAdapter: ProjectAdapter,
    private planService: PlanService,
    private permissionsService: PermissionsService,
    private configurationDataService: ConfigurationDataService,
    private loggedUserService: LoggedUserService,
    private userService: UserService) { }

  ngOnInit() {
    this.projectForm = this.formBuilder.group({
      privacy: ['', Validators.required],
      comments: ['', Validators.required],
    });
    this.configurationDataService.getConfigurationData().subscribe(data => {
      this.configurationData = data;
      this.privacies = this.configurationData.privacies.map(x => ({ name: x }));
    });

    this.getProjectData();
  }

  private setFormValues(): void {
    this.projectForm.get('comments').setValue(this.project.comment);
    this.selectedPrivacy = [{ name: this.project.privacyName }];
    this.projectForm.get('privacy').setValue(this.selectedPrivacy);
  }

  private getProjectData(): void {
    const id = this.route.snapshot.params.id;
    this.projectService.getProject(id).subscribe(data => {
      this.project = this.projectAdapter.adapt(data);
      this.originalProjectAsString = JSON.stringify(data);
      this.getProductionPlans();
      this.getPhenotypingPlans();
      this.loadIntentionsByType();
      this.loadPermissions();
      this.setFormValues();
      this.error = null;
    }, error => {
      this.error = error;
    });
  }

  loadPermissions(): void {
    if (this.loggedUserService.getLoggerUser()) {
      this.permissionsService.evaluatePermissionByActionOnResource(
        PermissionsService.UPDATE_PROJECT_ACTION, this.project.tpn).subscribe(canUpdateProject => {
          this.canUpdateProject = canUpdateProject;
          this.error = null;
        }, error => {
          this.error = error;
        });
    } else {
      this.canUpdateProject = false;
    }
  }

  private loadIntentionsByType() {
    this.projectIntentionsByGene = this.getGeneIntentions();
    this.projectIntentionsBySequence = this.getSequenceIntentions();
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


  onActiveSelected(): void {
    this.project.isActive = !this.project.isActive;
    console.log('Updated is_active in memory...');
  }

  onWithdrawnSelected(): void {
    this.project.withdrawn = !this.project.withdrawn;
    console.log('Updated withdrawn in memory...');
  }

  onRecoverySelected(): void {
    this.project.recovery = !this.project.recovery;
    console.log('Updated recovery in memory...');
  }

  onTextCommentChanged(e): void {
    const newComments = this.projectForm.get('comments').value;
    this.project.comment = newComments;
    console.log('Updated comment in memory...');
  }

  onItemSelect(e): void {
    this.project.privacyName = e;
    console.log('Updated privacy in memory...');

  }

  updateProject(): void {
    console.log('Update project...', this.project);
    console.log('originalProject', this.originalProjectAsString);
  }

  shouldUpdateBeEnabled(): boolean {
    return this.originalProjectAsString !== JSON.stringify(this.project);
  }

  getSequenceIntentionsByType(type: string): ProjectIntention[] {
    const projectIntentions: ProjectIntention[] = [];
    let result = null;
    if (this.project.projectIntentions) {
      this.project.projectIntentions.filter(x => x.intentionTypeName === type).map(x => projectIntentions.push(x));
      if (projectIntentions.length === 0) {
        result = null;
      } else {
        result = projectIntentions;
      }
    }
    return result;
  }

  getGeneIntentions(): ProjectIntention[] {
    return this.getSequenceIntentionsByType('gene');
  }

  getSequenceIntentions(): ProjectIntention[] {
    return this.getSequenceIntentionsByType('sequence');
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

}
