import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfigurationData, PermissionsService, ConfigurationDataService, LoggedUserService } from 'src/app/core';
import { Plan } from '../../model/plan';

@Component({
  selector: 'app-plan-details',
  templateUrl: './plan-details.component.html',
  styleUrls: ['./plan-details.component.css']
})
export class PlanDetailsComponent implements OnInit {

  @Input() plan: Plan;

  canUpdatePlan: boolean;

  editPlanDetails: FormGroup;

  privacies: NamedValue[] = [];
  selectedPrivacy = [];

  configurationData: ConfigurationData;

  constructor(
    private formBuilder: FormBuilder,
    private permissionsService: PermissionsService,
    private configurationDataService: ConfigurationDataService,
    private loggedUserService: LoggedUserService) { }

  ngOnInit() {
    this.configurationDataService.getConfigurationData().subscribe(data => {
      this.configurationData = data;
      this.privacies = this.configurationData.privacies.map(x => ({ name: x }));
    });

    this.loadPermissions();

    this.editPlanDetails = this.formBuilder.group({
      privacy: ['', Validators.required],
      comment: ['', Validators.required],
    });

    this.editPlanDetails.get('comment').setValue(this.plan.comment);
  }

  loadPermissions(): void {
    if (this.loggedUserService.getLoggerUser()) {
    this.permissionsService.evaluatePermissionByActionOnResource(
      PermissionsService.UPDATE_PLAN_ACTION, this.plan.pin).subscribe(canUpdatePlan => {
        this.canUpdatePlan = canUpdatePlan;

      }, error => {
        console.error('Error getting permissions');
      });
    } else {
      this.canUpdatePlan = false;
    }
  }

  onTextCommentChanged() {
    const newComments = this.editPlanDetails.get('comment').value;
    this.plan.comment = newComments;
  }

  onProductsAvailableGeneralPublic() {
    this.plan.productsAvailableForGeneralPublic = !this.plan.productsAvailableForGeneralPublic;
  }

}
