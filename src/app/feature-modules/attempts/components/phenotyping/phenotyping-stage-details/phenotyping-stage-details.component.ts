import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigurationDataService, PermissionsService, LoggedUserService, ConfigurationData, ChangesHistory } from 'src/app/core';
import { PhenotypingStageService } from 'src/app/feature-modules/plans/services/phenotyping-stage.service';
import { PhenotypingStage } from '../../../model/phenotyping/phenotyping-stage';
import { NamedValue } from 'src/app/core/model/common/named-value';
import { ChangeResponse } from 'src/app/core/model/history/change-response';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UpdateNotificationComponent } from 'src/app/feature-modules/plans/components/update-notification/update-notification.component';
import { Plan } from 'src/app/feature-modules/plans/model/plan';
import { PlanService } from 'src/app/feature-modules/plans';
import { ProjectService } from '../../../../projects';

@Component({
    selector: 'app-phenotyping-stage-details',
    templateUrl: './phenotyping-stage-details.component.html',
    styleUrls: ['./phenotyping-stage-details.component.css'],
    standalone: false
})
export class PhenotypingStageDetailsComponent implements OnInit {

  phenotypingStage: PhenotypingStage = new PhenotypingStage();

  canUpdate: boolean;
  loading = false;
  error: string;
  geneSymbol: string;

  phenotypingStagesTypesByAttemptTypes = new Map<string, NamedValue[]>();

  changeDetails: ChangesHistory;

  isNew = false;

  phenotypingStageForm: FormGroup;
  configurationData: ConfigurationData;

  originalphenotypingStageAsString: string;

  pin: string;
  psn: string;
  tpn: string;

  plan: Plan;

  filteredPhenotypingStagesTypesByAttemptTypes: NamedValue[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private phenotypingStageService: PhenotypingStageService,
    private configurationDataService: ConfigurationDataService,
    private permissionsService: PermissionsService,
    private planService: PlanService,
    private projectService: ProjectService,
    private loggedUserService: LoggedUserService) { }

  ngOnInit(): void {
    this.pin = this.route.snapshot.params.pid;
    this.psn = this.route.snapshot.params.psn;
    this.tpn = this.route.snapshot.params.id;
    this.fetchPlan(this.pin);
    this.evaluateUpdatePermissions();
    this.loadConfigurationData();
    this.fetchOrCreatePhenotypingStage();
    this.phenotypingStageForm = this.formBuilder.group({
    });
  }

  fetchPlan(pin: string) {
    this.planService.getPlanByPin(pin).subscribe(data => {
      this.plan = data;
      this.filteredPhenotypingStagesTypesByAttemptTypes = this.phenotypingStagesTypesByAttemptTypes.get(this.plan.attemptTypeName);
      // eslint-disable-next-line no-underscore-dangle
      const projectUrl = data._links.project.href;
      this.loadProject(projectUrl);
    }, error => {
      this.error = error;
    });
  }

  loadProject(projectUrl: any) {
    this.projectService.getProjectByUrl(projectUrl).subscribe(data => {
      this.geneSymbol = data.projectIntentions[0].intentionByGene.gene.symbol;
    }, error => {
      this.error = error;
      console.log(error);
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
      Object.keys(this.configurationData.phenotypingStagesTypesByAttemptTypes).map(key => {
        const list = this.configurationData.phenotypingStagesTypesByAttemptTypes[key];
        this.phenotypingStagesTypesByAttemptTypes.set(key, list.map(x => ({ name: x })));
      });
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
      // eslint-disable-next-line no-underscore-dangle
      const link: string = changeResponse._links.self.href;
      const psn = link.substring(link.lastIndexOf('/') + 1);
      this.reloadForPsn(psn);
      this.error = null;
    },
      error => {
        console.error('Error while creating phenotyping stage', error);
        this.error = error;
        this.loading = false;
      }
    );

  }

  reloadForPsn(psn: string) {
    this.router.navigate(['/projects/' + this.tpn + '/phenotyping-plan/' + this.pin + '/phenotyping-stage/' + psn]);
  }

  update() {
    this.loading = true;
    this.phenotypingStageService.updatePhenotypingStage(this.pin, this.phenotypingStage).subscribe((changeResponse: ChangeResponse) => {
      this.loading = false;
      this.originalphenotypingStageAsString = JSON.stringify(this.phenotypingStage);
      this.showChangeNotification(changeResponse);
      this.error = null;
      this.fetchPhenotypingStage();
    },
      error => {
        console.error('Error while updating phenotyping stage', error);
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

