import { Component, Input, OnInit } from '@angular/core';
import { EsCellAttempt } from '../../../model/production/escell/escell-attempt';
import { ConfigurationDataService, ConfigurationData } from 'src/app/core';
import { NamedValue } from 'src/app/core/model/common/named-value';

@Component({
  selector: 'app-escell-attempt',
  templateUrl: './escell-attempt.component.html',
  styleUrls: ['./escell-attempt.component.css']
})
export class EscellAttemptComponent implements OnInit {

  @Input() esCellAttempt: EsCellAttempt;
  @Input() canUpdatePlan: boolean;

  blastStrains: NamedValue[];
  testCrossStrains: NamedValue[];
  configurationData: ConfigurationData;

  constructor(private configurationDataService: ConfigurationDataService) { }

  ngOnInit(): void {
    this.loadConfigurationData();
  }

  loadConfigurationData() {
    this.configurationDataService.getConfigurationData().subscribe(data => {
      this.configurationData = data;
      this.blastStrains = this.configurationData.blastStrains.map(x => ({ name: x }));
      this.testCrossStrains = this.configurationData.testCrossStrains.map(x => ({ name: x }));
    });
  }

  onDateChanged() {
    const selectedDate = this.esCellAttempt.miDate;
    this.esCellAttempt.miDate = new Date(Date.UTC(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate()));
  }

  onMatingDateChanged() {
    const selectedDate = this.esCellAttempt.dateChimerasMated;
    this.esCellAttempt.dateChimerasMated = new Date(Date.UTC(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate()));
  }

  onCassetteTransmissionChanged() {
    const selectedDate = this.esCellAttempt.cassetteTransmissionVerified;
    // eslint-disable-next-line max-len
    this.esCellAttempt.cassetteTransmissionVerified = new Date(Date.UTC(selectedDate.getFullYear(),selectedDate.getMonth(),selectedDate.getDate()));
  }

}
