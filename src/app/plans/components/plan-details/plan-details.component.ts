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
    this.configurationData = this.configurationDataService.getConfigurationInfo();
    console.log('PlanDetailsComponent::planDetails:', this.planDetails);
    this.permissionsService.evaluatePermissionByActionOnResource(
      PermissionsService.UPDATE_PLAN_ACTION, this.planDetails.pin).subscribe(canUpdatePlan => {
        this.canUpdatePlan = canUpdatePlan;
        console.log('checked if can ', PermissionsService.UPDATE_PLAN_ACTION, 'on', this.planDetails.pin, ':', this.canUpdatePlan);
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
    });

    this.privacies = this.configurationData.privacies.map(x => { return { name: x } });
    console.log('this.privacies', this.privacies);

    this.selectedPrivacy = [{ name: this.planDetails.privacyName }];
    this.editPlanDetails.get('privacy').setValue(this.selectedPrivacy);
  }

  updatePlanDetails() {
    console.log('Emmits change', this.planDetails);
    this.modifiedPlanDetailsEmmiter.emit(this.planDetails);
  }

  onItemSelect(e) {
    console.log('This is the event', e);
    console.log('this.selectedPrivacy ', this.selectedPrivacy);
    this.planDetails.privacyName = e;
    this.updatePlanDetails();
  }

}
