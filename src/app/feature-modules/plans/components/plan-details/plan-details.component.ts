import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PlanDetails } from '../..';
import { ConfigurationData, PermissionsService, ConfigurationDataService } from 'src/app/core';


@Component({
  selector: 'app-plan-details',
  templateUrl: './plan-details.component.html',
  styleUrls: ['./plan-details.component.css']
})
export class PlanDetailsComponent implements OnInit {

  @Input() planDetails: PlanDetails;
  @Output() modifiedPlanDetailsEmmiter = new EventEmitter<PlanDetails>();
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
    console.log('PlanDetailsComponent::planDetails', this.planDetails);

    this.configurationData = this.configurationDataService.getConfigurationInfo();
    this.permissionsService.evaluatePermissionByActionOnResource(
      PermissionsService.UPDATE_PLAN_ACTION, this.planDetails.pin).subscribe(canUpdatePlan => {
        this.canUpdatePlan = canUpdatePlan;
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
    this.editPlanDetails.get('comments').setValue(this.planDetails.comments);

    this.selectedPrivacy = [{ name: this.planDetails.privacyName }];
    this.editPlanDetails.get('privacy').setValue(this.selectedPrivacy);
  }

  updatePlanDetails() {
    this.modifiedPlanDetailsEmmiter.emit(this.planDetails);
  }

  onItemSelect(e) {
    this.planDetails.privacyName = e;
    this.updatePlanDetails();
  }

  onTextCommentChanged(e) {
    const newComments = this.editPlanDetails.get('comments').value;
    this.planDetails.comments = newComments;
    this.updatePlanDetails();
  }

}
