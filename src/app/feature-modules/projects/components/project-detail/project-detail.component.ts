import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../model/project';
import { PlanService } from 'src/app/feature-modules/plans';
import { Plan } from 'src/app/feature-modules/plans/model/plan';
import { ConfigurationData, PermissionsService, ConfigurationDataService } from 'src/app/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

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

  assignmentStatusDatesColumns = ['name', 'date'];

  dropdownSettingsSingle = {};
  configurationData: ConfigurationData;

  privacies: any[] = [];
  selectedPrivacy = [];

  projectForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private planService: PlanService,
    private permissionsService: PermissionsService,
    private configurationDataService: ConfigurationDataService) { }

  ngOnInit() {

    this.projectForm = this.formBuilder.group({
      privacy: ['', Validators.required],
      comments: ['', Validators.required],
    });
    this.configurationData = this.configurationDataService.getConfigurationInfo();

    this.dropdownSettingsSingle = {
      singleSelection: true,
      idField: 'name',
      textField: 'name',
      enableCheckAll: false,
      allowSearchFilter: true
    };

    this.getProjectData();
  }

  private setFormValues() {
    this.privacies = this.configurationData.privacies.map(x => { return { name: x } });
    this.projectForm.get('comments').setValue(this.project.comment);

    this.selectedPrivacy = [{ name: this.project.privacy_name }];
    this.projectForm.get('privacy').setValue(this.selectedPrivacy);
  }

  private getProjectData() {
    let id = this.route.snapshot.params['id'];
    this.projectService.getProject(id).subscribe(data => {
      this.project = data;
      this.originalProjectAsString = JSON.stringify(data);
      console.log('this.project', this.project);
      this.getProductionPlans();
      this.gethenotypingPlans();
      this.loadPermissions();
      this.setFormValues();
    });
  }

  loadPermissions() {
    this.permissionsService.evaluatePermissionByActionOnResource(
      PermissionsService.UPDATE_PROJECT_ACTION, this.project.tpn).subscribe(canUpdateProject => {
        this.canUpdateProject = canUpdateProject;
        console.log('canUpdateProject=>', canUpdateProject);
      }, error => {
        console.log('Error getting permissions');
      });
  }

  private getProductionPlans() {
    this.project._links.production_plans.map(x => {
      this.planService.getPlanByUrl(x.href).subscribe(plan => {
        console.log('the url', x.href);

        console.log('Got a production plan', plan);

        this.productionPlansDetails.push(plan);
      }, error => {
        console.log('Error getting plan...', error);
      });
    });
  }

  private gethenotypingPlans() {
    this.project._links.phenotyping_plans.map(x => {
      this.planService.getPlanByUrl(x.href).subscribe(plan => {
        this.phenotypingPlansDetails.push(plan);
      }, error => {
        console.log('Error getting plan...', error);
      });
    });
  }

  onActiveSelected() {
    this.project.is_active = !this.project.is_active;
    console.log('Updated is_active in memory...');
  }

  onWithdrawnSelected() {
    this.project.withdrawn = !this.project.withdrawn;
    console.log('Updated withdrawn in memory...');
  }

  onRecoverySelected() {
    this.project.recovery = !this.project.recovery;
    console.log('Updated recovery in memory...');
  }

  onTextCommentChanged(e) {
    const newComments = this.projectForm.get('comments').value;
    this.project.comment = newComments;
    console.log('Updated comment in memory...');
  }

  onItemSelect(e) {
    this.project.privacy_name = e;
    console.log('Updated privacy in memory...');
    
  }

  updateProject() {
    console.log('Update project...', this.project);
    console.log('originalProject', this.originalProjectAsString);
  }

  shouldUpdateBeEnabled() {
    return this.originalProjectAsString != JSON.stringify(this.project);
  }
}
