import { Component, OnInit, Input } from '@angular/core';
import { PhenotypingAttempt } from '../../../model/phenotyping/phenotyping_attempt';
import { ConfigurationData, ConfigurationDataService } from 'src/app/core';
import { NamedValue } from 'src/app/core/model/common/named-value';
import { Plan } from 'src/app/feature-modules/plans/model/plan';

@Component({
    selector: 'app-phenotyping-attempt-details',
    templateUrl: './phenotyping-attempt-details.component.html',
    styleUrls: ['./phenotyping-attempt-details.component.css'],
    standalone: false
})
export class PhenotypingAttemptDetailsComponent implements OnInit {
  @Input() plan: Plan;
  @Input() phenotypingAttempt: PhenotypingAttempt;
  @Input() canUpdatePlan: boolean;


  configurationData: ConfigurationData;
  backGroundStrains: NamedValue[];
  workUnits: NamedValue[];

  constructor(private configurationDataService: ConfigurationDataService, ) { }

  ngOnInit(): void {
    this.loadConfigurationData();
  }

  loadConfigurationData() {
    this.configurationDataService.getConfigurationData().subscribe(data => {
      this.configurationData = data;
      this.backGroundStrains = this.configurationData.backgroundStrains.map(x => ({ name: x }));
      this.workUnits = this.configurationData.workUnits.map(x => ({ name: x }));
    });
  }

  dataChanged(e) {
    this.plan.phenotypingAttempt = {
      phenotypingExternalRef: this.phenotypingAttempt.phenotypingExternalRef,
      phenotypingBackgroundStrainName: this.phenotypingAttempt.phenotypingBackgroundStrainName,
      doNotCountTowardsCompleteness: this.phenotypingAttempt.doNotCountTowardsCompleteness,
      cohortProductionWorkUnitName: this.phenotypingAttempt.cohortProductionWorkUnitName
    };
  }

}
