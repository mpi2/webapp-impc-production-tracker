import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigurationDataService, ConfigurationData } from 'src/app/core';
import { NamedValue } from 'src/app/core/model/common/named-value';
import { Plan } from '../../model/plan';
import { PlanService } from '../../services/plan.service';
import { ChangeResponse } from 'src/app/core/model/history/change-response';

@Component({
  selector: 'app-plan-creation',
  templateUrl: './plan-creation.component.html',
  styleUrls: ['./plan-creation.component.css']
})
export class PlanCreationComponent implements OnInit {
  tpn: string;
  error;

  plan: Plan = new Plan();

  configurationData: ConfigurationData;

  planTypes: NamedValue[];
  attemptTypes: NamedValue[];
  workUnits: NamedValue[];
  workGroups: NamedValue[];
  funders: NamedValue[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private configurationDataService: ConfigurationDataService,
    private planService: PlanService) { }

  ngOnInit(): void {
    this.tpn = this.route.snapshot.params.id;
    this.plan.tpn = this.tpn;
    this.loadConfigurationData();
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

  onPlanTypeSelected(e) {
    console.log('plan', e);
    console.log(this.plan);


  }

  onAttemptTypeSelected(e) {
    console.log('attempt', e);
    console.log(this.plan);
  }

  create() {
    console.log('create');
    this.planService.createPlan(this.plan).subscribe((changeResponse: ChangeResponse) => {
      console.log('data', changeResponse);
      const link: string = changeResponse._links.self.href;
      const pin = link.substring(link.lastIndexOf('/') + 1);
      console.log(link);
      console.log(pin);
      this.router.navigate(['/projects/' + this.tpn + '/plan/' + pin]);


    }, error => {
      console.log('error', error);
    });
    // this.router.navigate(['/role']);
  }

}
