import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CrisprAttempt } from 'src/app/feature-modules/attempts';
import { Nuclease } from 'src/app/feature-modules/attempts/model/production/crispr/nuclease';
import { ConfigurationData, ConfigurationDataService } from 'src/app/core';
import { NamedValue } from 'src/app/core/model/common/named-value';


@Component({
  selector: 'app-nuclease',
  templateUrl: './nuclease.component.html',
  styleUrls: ['./nuclease.component.css']
})
export class NucleaseComponent implements OnInit, OnChanges {

  @Input() crisprAttempt: CrisprAttempt;
  @Input() canUpdatePlan: boolean;

  dataSource: Nuclease[];
  configurationData: ConfigurationData;

  nucleaseTypes: NamedValue[];
  nucleaseClases: NamedValue[];

  constructor(
    private configurationDataService: ConfigurationDataService) { }

  ngOnInit() {
    this.canUpdatePlan = false;
    this.configurationDataService.getConfigurationData().subscribe(data => {
      this.configurationData = data;
      this.nucleaseTypes = this.configurationData.nucleaseTypes.map(x => ({ name: x }));
      this.nucleaseClases = this.configurationData.nucleaseClasses.map(x => ({ name: x }));
    });
    this.setInitialData();
  }

  setInitialData(): void {
    this.dataSource = this.crisprAttempt.nucleases;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.crisprAttempt) {
      this.crisprAttempt = changes.crisprAttempt.currentValue;
      this.setInitialData();
    }
  }

  onNucleaseChanged(nuclease: Nuclease) {
    this.convertNumericFields(nuclease);
  }

  onClickToDeleteElement(nuclease: Nuclease) {
    console.log('Nuclease deleted:', nuclease);
  }

  convertNumericFields(nuclease: Nuclease): void {
    const concentrationAsString = nuclease.concentration ? nuclease.concentration.toString() : '';
    if (concentrationAsString.charAt(concentrationAsString.length - 1) !== '.') {
      nuclease.concentration = this.getNumericValueOrNull(nuclease.concentration);
    }
  }

  getNumericValueOrNull(value): number {
    if (!value || isNaN(value) || '' === value) {
      return null;
    }
    return Number(value);
  }

}
