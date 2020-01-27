import { Component, OnInit, Input } from '@angular/core';
import { CrisprAttempt } from 'src/app/feature-modules/attempts';
import { Nuclease } from 'src/app/feature-modules/attempts/model/production/crispr/nuclease';
import { ConfigurationData, ConfigurationDataService } from 'src/app/core';

@Component({
  selector: 'app-nuclease',
  templateUrl: './nuclease.component.html',
  styleUrls: ['./nuclease.component.css']
})
export class NucleaseComponent implements OnInit {

  @Input() crisprAttempt: CrisprAttempt;
  @Input() canUpdatePlan: boolean;

  dataSource: Nuclease[];
  configurationData: ConfigurationData;

  nucleaseTypes: NamedValue[];
  nucleaseClases: NamedValue[];

  constructor(private configurationDataService: ConfigurationDataService) { }

  ngOnInit() {
    this.canUpdatePlan = false;
    this.configurationDataService.getConfigurationData().subscribe(data => {
      this.configurationData = data;
      console.log(data);

      this.nucleaseTypes = this.configurationData.nucleaseTypes.map(x => ({ name: x }));
      this.nucleaseClases = this.configurationData.nucleaseClasses.map(x => ({ name: x }));
    });
    this.setInitialData();
  }

  setInitialData(): void {
    this.dataSource = this.crisprAttempt.nucleases;
    console.log(this.dataSource );

  }

  onNucleaseChanged(nuclease: Nuclease) {
    console.log('Nuclease changed:', nuclease);
  }

  onClickToDeleteElement(nuclease: Nuclease) {
    console.log('Nuclease deleted:', nuclease);
  }

}
