import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigurationDataService, ConfigurationData } from 'src/app/core';
import { NamedValue } from 'src/app/core/model/common/named-value';
import { Plan } from '../../model/plan';
import { PlanService } from '../../services/plan.service';
import { ChangeResponse } from 'src/app/core/model/history/change-response';
import { PhenotypingStartingPoint } from 'src/app/feature-modules/attempts/model/phenotyping/phenotyping_starting_point';
import { Project } from 'src/app/model';
import { ProjectService } from 'src/app/feature-modules/projects';

@Component({
  selector: 'app-plan-creation',
  templateUrl: './plan-creation.component.html',
  styleUrls: ['./plan-creation.component.css']
})
export class PlanCreationComponent implements OnInit {
  tpn: string;
  error;
  loading = false;

  plan: Plan = new Plan();


  configurationData: ConfigurationData;

  planTypes: NamedValue[];
  attemptTypes: NamedValue[];
  workUnits: NamedValue[];
  workGroups: NamedValue[];
  funders: NamedValue[];
  startingPoints: NamedValue[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private configurationDataService: ConfigurationDataService,
    private projectService: ProjectService,
    private planService: PlanService) { }

  ngOnInit(): void {
    this.tpn = this.route.snapshot.params.id;
    this.plan.tpn = this.tpn;
    this.loadConfigurationData();
    this.loadTpos(this.tpn);
  }

  loadConfigurationData() {
    this.configurationDataService.getConfigurationData().subscribe(data => {
      this.configurationData = data;
      this.planTypes = this.configurationData.planTypes.map(x => ({ name: x }));
      this.attemptTypes = this.configurationData.attemptTypes.map(x => ({ name: x }));
      this.workUnits = this.configurationData.workUnits.map(x => ({ name: x }));
      this.workGroups = this.configurationData.workGroups.map(x => ({ name: x }));
      this.funders = this.configurationData.funders.map(x => ({ name: x }));
    }, error => {
      this.error = error;
    });
  }

  loadTpos(tpn: string) {
    this.projectService.getProductionTposByProject(tpn).subscribe(data => {
      this.startingPoints = data.map(x => ({ name: x }));

    }, error => {
      this.error = error;
    });
  }

  onPlanTypeSelected(e) {
    console.log('e.value', e.value);
    if (e.value === 'phenotyping') {
      this.plan.phenotypingStartingPoint = new PhenotypingStartingPoint();
    }
  }

  onAttemptTypeSelected(e) {
    console.log('attempt', e);
    console.log(this.plan);
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
