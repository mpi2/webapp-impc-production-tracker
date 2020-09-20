import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigurationDataService, ConfigurationData, LoggedUserService } from 'src/app/core';
import { NamedValue } from 'src/app/core/model/common/named-value';
import { ChangeResponse } from 'src/app/core/model/history/change-response';
import { PhenotypingStartingPoint } from 'src/app/feature-modules/attempts/model/phenotyping/phenotyping_starting_point';
import { ProjectCreation, ProjectService } from 'src/app/feature-modules/projects';
import { User } from 'src/app/core/model/user/user';
import { Plan } from 'src/app/feature-modules/plans/model/plan';
import { ProductionOutcomeSummary } from 'src/app/feature-modules/plans/model/outcomes/production-outcome-summary';
import { PlanService } from 'src/app/feature-modules/plans';

@Component({
  selector: 'app-plan-creation',
  templateUrl: './plan-creation.component.html',
  styleUrls: ['./plan-creation.component.css']
})
export class PlanCreationComponent implements OnInit {
  @Input() projectCreation: ProjectCreation;

  tpn: string;
  error;
  loading = false;
  planCreation = true;

  plan: Plan = new Plan();
  showAllElementsInLists = false;

  configurationData: ConfigurationData;
  loggedUser: User;

  planTypes: NamedValue[];
  filteredAttemptTypesByPlanType: NamedValue[] = [];
  workUnits: NamedValue[];
  filteredWorkGroupsByWorkUnit: NamedValue[] = [];
  filteredFundersByWorkGroup: NamedValue[] = [];

  startingPoints: ProductionOutcomeSummary[];

  workGroupsByWorkGroup = new Map<string, NamedValue[]>();
  attemptTypesByPlanTypes = new Map<string, NamedValue[]>();
  fundersByWorkGroups = new Map<string, NamedValue[]>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loggedUserService: LoggedUserService,
    private configurationDataService: ConfigurationDataService,
    private projectService: ProjectService,
    private planService: PlanService) { }

  ngOnInit(): void {
    if (!this.projectCreation) {
      this.tpn = this.route.snapshot.params.id;
      this.plan.tpn = this.tpn;
      this.loadOutcomesSummaries(this.tpn);
    } else {
      this.planCreation = false;
      this.projectCreation.planDetails = this.plan;
    }
    this.loadConfigurationData();
  }

  loadConfigurationData() {
    this.configurationDataService.getConfigurationData().subscribe(data => {
      this.configurationData = data;
      if (!this.projectCreation) {
        this.planTypes = this.configurationData.planTypes.map(x => ({ name: x }));
      } else {
        this.planTypes = this.configurationData.planTypes.map(x => ({ name: x })).filter( x => x.name === 'production');
      }
      this.workUnits = this.configurationData.workUnits.map(x => ({ name: x }));

      Object.keys(this.configurationData.workGroupsByWorkUnits).map(key => {
        const list = this.configurationData.workGroupsByWorkUnits[key];
        this.workGroupsByWorkGroup.set(key, list.map(x => ({ name: x })));
      });

      Object.keys(this.configurationData.attemptTypesByPlanTypes).map(key => {
        const list = this.configurationData.attemptTypesByPlanTypes[key];
        this.attemptTypesByPlanTypes.set(key, list.map(x => ({ name: x })));
      });

      Object.keys(this.configurationData.fundersByWorkGroups).map(key => {
        const list = this.configurationData.fundersByWorkGroups[key];
        this.fundersByWorkGroups.set(key, list.map(x => ({ name: x })));
      });
      this.filterLists();
    }, error => {
      this.error = error;
    });
  }

  filterLists() {
    this.loggedUserService.getLoggerUser().subscribe(data => {
      this.loggedUser = data;
      this.showAllElementsInLists = data.isAdmin;
      if (!this.showAllElementsInLists) {
        this.workUnits = this.loggedUser.rolesWorkUnits.map(x => ({ name: x.workUnitName }));
      }

    }, error => {
      this.error = error;
    });
  }

  loadOutcomesSummaries(tpn: string) {
    this.projectService.getProductionOutcomesSummariesByProject(tpn).subscribe(data => {
      this.startingPoints = data;

    }, error => {
      this.error = error;
    });
  }

  onPlanTypeSelected(e) {
    if (e.value === 'phenotyping') {
      this.plan.phenotypingStartingPoint = new PhenotypingStartingPoint();
    }
    this.filteredAttemptTypesByPlanType = this.attemptTypesByPlanTypes.get(e.value);
  }

  onAttemptTypeSelected(e) {
  }

  onWorkUnitChanged(e) {
    this.filteredWorkGroupsByWorkUnit = this.workGroupsByWorkGroup.get(e.value);
    this.filteredFundersByWorkGroup = [];
  }

  onWorkGroupChanged(e) {
    this.filteredFundersByWorkGroup = this.fundersByWorkGroups.get(e.value);
  }

  create() {
    this.loading = true;
    this.planService.createPlan(this.plan).subscribe((changeResponse: ChangeResponse) => {
      this.loading = false;
      const link: string = changeResponse._links.self.href;
      const pin = link.substring(link.lastIndexOf('/') + 1);
      this.router.navigate(['/projects/' + this.tpn + '/plan/' + pin]);
    }, error => {
      this.error = error;
      this.loading = false;
    });
  }

}
