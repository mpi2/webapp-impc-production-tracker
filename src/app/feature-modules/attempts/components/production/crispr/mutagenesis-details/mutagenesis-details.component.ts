import { Component, OnInit, Input } from '@angular/core';
import { CrisprAttempt } from 'src/app/feature-modules/attempts/model/production/crispr/crispr-attempt';
import { ConfigurationDataService, ConfigurationData } from 'src/app/core';
import { NamedValue } from 'src/app/core/model/common/named-value';

@Component({
    selector: 'app-mutagenesis-details',
    templateUrl: './mutagenesis-details.component.html',
    styleUrls: ['./mutagenesis-details.component.css'],
    standalone: false
})
export class MutagenesisDetailsComponent implements OnInit {

  @Input() crisprAttempt: CrisprAttempt;
  @Input() canUpdatePlan: boolean;

  strains: NamedValue[];
  configurationData: ConfigurationData;

  constructor(private configurationDataService: ConfigurationDataService) { }

  ngOnInit() {
    this.loadConfigurationData();
  }

  loadConfigurationData() {
    this.configurationDataService.getConfigurationData().subscribe(data => {
      this.configurationData = data;
      this.strains = this.configurationData.backgroundStrains.map(x => ({ name: x }));
    });
  }

}
