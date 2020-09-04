import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConfigurationDataService, PermissionsService, LoggedUserService, ConfigurationData } from 'src/app/core';
import { PhenotypingStageService } from 'src/app/feature-modules/plans/services/phenotyping-stage.service';
import { PhenotypingStage } from '../../../model/phenotyping/phenotyping-stage';
import { NamedValue } from 'src/app/core/model/common/named-value';

@Component({
  selector: 'app-phenotyping-stage-details',
  templateUrl: './phenotyping-stage-details.component.html',
  styleUrls: ['./phenotyping-stage-details.component.css']
})
export class PhenotypingStageDetailsComponent implements OnInit {

  phenotypingStage: PhenotypingStage = new PhenotypingStage();

  canUpdate: boolean;
  loading = false;
  error: string;

  phenotypingStagesTypes: NamedValue[];

  isNew = false;

  phenotypingStageForm: FormGroup;
  configurationData: ConfigurationData;

  pin: string;
  psn: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private phenotypingStageService: PhenotypingStageService,
    private configurationDataService: ConfigurationDataService,
    private permissionsService: PermissionsService,
    private loggedUserService: LoggedUserService) { }

  ngOnInit(): void {
    this.pin = this.route.snapshot.params.pid;
    this.psn = this.route.snapshot.params.psn;
    this.evaluateUpdatePermissions();
    this.loadConfigurationData();
    this.fetchOrCreatePhenotypingStage();
    this.phenotypingStageForm = this.formBuilder.group({
    });
  }

  evaluateUpdatePermissions() {
    if (this.loggedUserService.getLoggerUser()) {
      this.permissionsService.evaluatePermissionByActionOnResource(
        PermissionsService.UPDATE_PLAN_ACTION, this.pin).subscribe(canUpdate => {
          this.canUpdate = canUpdate;
          this.error = null;
        },
          error => {
            this.error = error;
          });
    } else {
      this.canUpdate = false;
    }
  }

  loadConfigurationData() {
    this.configurationDataService.getConfigurationData().subscribe(data => {
      this.configurationData = data;
      this.phenotypingStagesTypes = this.configurationData.phenotypingStagesTypes.map(x => ({ name: x }));
    });
  }

  fetchOrCreatePhenotypingStage() {
    if (this.psn) {
      this.isNew = false;
      this.fetchPhenotypingStage();
    } else {
      this.isNew = true;
      throw new Error('Method not implemented.');
    }

  }

  fetchPhenotypingStage() {
    this.phenotypingStageService.getPhenotypingStageByPinAndPsn(this.pin, this.psn).subscribe(data => {
      console.log('got data', data);
      this.phenotypingStage = data;
    }, error => {
      console.error(error);

    });
  }

}
