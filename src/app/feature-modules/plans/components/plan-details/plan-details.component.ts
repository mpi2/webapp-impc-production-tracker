import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
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
  @Output() modifiedPlanDetailsEmmiter = new EventEmitter<Plan>();
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
    console.log('PlanDetailsComponent::plan', this.plan);

    this.configurationData = this.configurationDataService.getConfigurationInfo();
    console.log('Init...');

    this.permissionsService.evaluatePermissionByActionOnResource(
      PermissionsService.UPDATE_PLAN_ACTION, this.plan.pin).subscribe(canUpdatePlan => {
        this.canUpdatePlan = canUpdatePlan;
        console.log('canUpdatePlan=>',canUpdatePlan);
      }, error => {
        console.log('Error getting permissions');
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
      comments: ['', Validators.required],
    });

    this.privacies = this.configurationData.privacies.map(x => { return { name: x } });
    this.editPlanDetails.get('comments').setValue(this.plan.comment);

    this.selectedPrivacy = [{ name: this.plan.privacy_name }];
    this.editPlanDetails.get('privacy').setValue(this.selectedPrivacy);
  }

  updatePlanDetails() {
    this.modifiedPlanDetailsEmmiter.emit(this.plan);
  }

  onItemSelect(e) {
    this.plan.privacy_name = e;
    this.updatePlanDetails();
  }

  onTextCommentChanged(e) {
    const newComments = this.editPlanDetails.get('comments').value;
    this.plan.comment = newComments;
    this.updatePlanDetails();
  }

  onProductsAvailableGeneralPublic() {
    console.log('To be implemented');
  }

  onProductsAvailableGeneralPublicSelected() {
    // METHOD TO DO
  }

}
