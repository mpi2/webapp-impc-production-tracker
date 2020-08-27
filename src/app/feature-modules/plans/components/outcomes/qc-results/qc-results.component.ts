import { Component, OnInit, Input } from '@angular/core';
import { Mutation } from '../../../model/outcomes/mutation';
import { NamedValue } from 'src/app/core/model/common/named-value';
import { ConfigurationDataService, ConfigurationData } from 'src/app/core';

@Component({
  selector: 'app-qc-results',
  templateUrl: './qc-results.component.html',
  styleUrls: ['./qc-results.component.css']
})
export class QcResultsComponent implements OnInit {
  @Input() mutation: Mutation;
  @Input() canUpdate: boolean;

  qcTypes: NamedValue[];
  qcStatuses: NamedValue[];
  configurationData: ConfigurationData;

  constructor(private configurationDataService: ConfigurationDataService) { }

  ngOnInit(): void {
    this.loadConfigurationData();
  }

  loadConfigurationData() {
    this.configurationDataService.getConfigurationData().subscribe(data => {
      this.configurationData = data;
      this.qcTypes = this.configurationData.qcTypes.map(x => ({ name: x }));
      this.qcStatuses = this.configurationData.qcStatuses.map(x => ({ name: x }));
    });
  }

}
