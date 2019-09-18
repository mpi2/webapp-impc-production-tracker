import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfigurationData, PermissionsService, ConfigurationDataService } from 'src/app/core';
import { Plan } from '../../model/plan';

@Component({
  selector: 'app-plan-details',
  templateUrl: './plan-details.component.html',
  styleUrls: ['./plan-details.component.css']
})
export class PlanDetailsComponent implements OnInit {

  @Input() plan: Plan;

  canUpdatePlan: boolean;

  dropdownSettingsSingle = {};
  dropdownSettingsMultiple = {};

  editPlanDetails: FormGroup;

  privacies: any[] = [];
  selectedPrivacy = [];

  configurationData: ConfigurationData;

  constructor(
    private formBuilder: FormBuilder,
    private permissionsService: PermissionsService,
    private configurationDataService: ConfigurationDataService) { }

  ngOnInit() {
    this.configurationData = this.configurationDataService.getConfigurationInfo();

    this.permissionsService.evaluatePermissionByActionOnResource(
      PermissionsService.UPDATE_PLAN_ACTION, this.plan.pin).subscribe(canUpdatePlan => {
        this.canUpdatePlan = canUpdatePlan;

      }, error => {
        console.error('Error getting permissions');
      });

    this.dropdownSettingsSingle = {
      singleSelection: true,
      idField: 'name',
      textField: 'name',
      enableCheckAll: false,
      allowSearchFilter: true
    };

    this.dropdownSettingsMultiple = {
      singleSelection: false,
      idField: 'name',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true
    };

    this.editPlanDetails = this.formBuilder.group({
      privacy: ['', Validators.required],
      comment: ['', Validators.required],
    });

    this.privacies = this.configurationData.privacies.map(x => { return { name: x } });
    this.editPlanDetails.get('comment').setValue(this.plan.comment);
  }

  onTextCommentChanged() {
    const newComments = this.editPlanDetails.get('comment').value;
    this.plan.comment = newComments;
  }

  onProductsAvailableGeneralPublic() {
    this.plan.products_available_for_general_public = !this.plan.products_available_for_general_public;
  }

}
