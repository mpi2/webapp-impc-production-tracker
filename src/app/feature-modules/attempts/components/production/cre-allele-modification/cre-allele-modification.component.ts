import { Component, Input, OnInit } from '@angular/core';
import { CreAlleleModificationAttempt } from '../../../model/production/cre-allele-modification/cre-allele-modification-attempt';
import { ConfigurationDataService, ConfigurationData } from 'src/app/core';
import { NamedValue } from 'src/app/core/model/common/named-value';

@Component({
  selector: 'app-cre-allele-modification',
  templateUrl: './cre-allele-modification.component.html',
  styleUrls: ['./cre-allele-modification.component.css']
})
export class CreAlleleModificationComponent implements OnInit {
  @Input() creAlleleModificationAttempt: CreAlleleModificationAttempt;
  @Input() canUpdatePlan: boolean;

  deleterStrains: NamedValue[];
  configurationData: ConfigurationData;

  constructor(private configurationDataService: ConfigurationDataService) { }

  ngOnInit(): void {
    this.loadConfigurationData();
  }

  loadConfigurationData() {
    this.configurationDataService.getConfigurationData().subscribe(data => {
      this.configurationData = data;
      this.deleterStrains = this.configurationData.deleterStrains.map(x => ({ name: x }));
    });
  }

}
