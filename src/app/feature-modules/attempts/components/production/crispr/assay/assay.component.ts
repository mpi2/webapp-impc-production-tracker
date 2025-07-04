import { Component, OnInit, Input } from '@angular/core';
import { ConfigurationDataService, ConfigurationData } from 'src/app/core';
import { NamedValue } from 'src/app/core/model/common/named-value';
import { Assay } from 'src/app/feature-modules/attempts/model/production/crispr/assay';
import { CrisprAttempt } from 'src/app/feature-modules/attempts/model/production/crispr/crispr-attempt';

@Component({
    selector: 'app-assay',
    templateUrl: './assay.component.html',
    styleUrls: ['./assay.component.css'],
    standalone: false
})
export class AssayComponent implements OnInit {
  @Input() crisprAttempt: CrisprAttempt;
  @Input() canUpdatePlan: boolean;

  configurationData: ConfigurationData;
  assayTypes: NamedValue[] = [];

  constructor(private configurationDataService: ConfigurationDataService) { }

  ngOnInit(): void {
    this.loadConfigurationData();
  }

  loadConfigurationData() {
    this.configurationDataService.getConfigurationData().subscribe(data => {
      this.configurationData = data;
      this.assayTypes = this.configurationData.assayTypes.map(x => ({ name: x }));
    });
  }

}
