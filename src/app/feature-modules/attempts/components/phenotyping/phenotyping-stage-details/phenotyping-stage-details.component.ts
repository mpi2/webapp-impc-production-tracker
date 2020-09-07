import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConfigurationDataService, PermissionsService, LoggedUserService, ConfigurationData, ChangesHistory } from 'src/app/core';
import { PhenotypingStageService } from 'src/app/feature-modules/plans/services/phenotyping-stage.service';
import { PhenotypingStage } from '../../../model/phenotyping/phenotyping-stage';
import { NamedValue } from 'src/app/core/model/common/named-value';
import { ChangeResponse } from 'src/app/core/model/history/change-response';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UpdateNotificationComponent } from 'src/app/feature-modules/plans/components/update-notification/update-notification.component';

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

  changeDetails: ChangesHistory;

  isNew = false;

  phenotypingStageForm: FormGroup;
  configurationData: ConfigurationData;

  originalphenotypingStageAsString: string;

  pin: string;
  psn: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
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
      this.phenotypingStage = new PhenotypingStage();
    }

  }

  fetchPhenotypingStage() {
    this.phenotypingStageService.getPhenotypingStageByPinAndPsn(this.pin, this.psn).subscribe(data => {
      this.phenotypingStage = data;
      this.originalphenotypingStageAsString = JSON.stringify(data);
    }, error => {
      console.error(error);

    });
  }

  enableUpdateButton() {
    const changed = this.originalphenotypingStageAsString !== JSON.stringify(this.phenotypingStage);
    return changed;
  }

  updateOrCreate() {
    if (this.isNew) {
      this.create();

    } else {
      this.update();
    }

  }

  create() {
    this.loading = true;
    this.phenotypingStageService.createPhenotypingStage(this.pin, this.phenotypingStage).subscribe((changeResponse: ChangeResponse) => {
      this.loading = false;
      this.originalphenotypingStageAsString = JSON.stringify(this.phenotypingStage);
      this.showChangeNotification(changeResponse);
      this.error = null;
    },
      error => {
        console.error('Error while creating plan outcome', error);
        this.error = error;
        this.loading = false;
      }
    );

  }

  update() {
    this.loading = true;
    this.phenotypingStageService.updatePhenotypingStage(this.pin, this.phenotypingStage).subscribe((changeResponse: ChangeResponse) => {
      this.loading = false;
      this.originalphenotypingStageAsString = JSON.stringify(this.phenotypingStage);
      this.showChangeNotification(changeResponse);
      this.error = null;
    },
      error => {
        console.error('Error while updating plan outcome', error);
        this.error = error;
        this.loading = false;
      }
    );
  }

  private showChangeNotification(changeResponse: ChangeResponse) {
    if (changeResponse && changeResponse.history.length > 0) {
      this.changeDetails = changeResponse.history[0];
      this.snackBar.openFromComponent(UpdateNotificationComponent, {
        duration: 3000,
        data: this.changeDetails
      });
    }
  }
}

