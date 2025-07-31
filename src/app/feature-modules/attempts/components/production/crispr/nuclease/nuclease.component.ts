import { Component, OnInit, Input } from '@angular/core';
import { Nuclease } from 'src/app/feature-modules/attempts/model/production/crispr/nuclease';
import { ConfigurationData, ConfigurationDataService } from 'src/app/core';
import { NamedValue } from 'src/app/core/model/common/named-value';
import { InputHandlerService } from 'src/app/core/services/input-handler.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationComponent } from 'src/app/shared/components/delete-confirmation/delete-confirmation.component';
import { CrisprAttempt } from 'src/app/feature-modules/attempts/model/production/crispr/crispr-attempt';


@Component({
    selector: 'app-nuclease',
    templateUrl: './nuclease.component.html',
    styleUrls: ['./nuclease.component.css'],
    standalone: false
})
export class NucleaseComponent implements OnInit {

  @Input() crisprAttempt: CrisprAttempt;
  @Input() canUpdatePlan: boolean;

  dataSource: Nuclease[];
  configurationData: ConfigurationData;

  nucleaseTypes: NamedValue[];
  nucleaseClases: NamedValue[];

  tmpIndexRowName = 'tmp_id';
  nextNewId = -1;

  constructor(
    private configurationDataService: ConfigurationDataService,
    private inputHandlerService: InputHandlerService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.configurationDataService.getConfigurationData().subscribe(data => {
      this.configurationData = data;
      this.nucleaseTypes = this.configurationData.nucleaseTypes.map(x => ({ name: x }));
      this.nucleaseClases = this.configurationData.nucleaseClasses.map(x => ({ name: x }));

      this.setInitialData();
    });
  }

  setInitialData(): void {
    if (this.crisprAttempt.nucleases.length === 0) {
      const nuclease = new Nuclease();
      nuclease.id = -1;
      if (this.nucleaseTypes !== undefined) {
        nuclease.typeName = this.nucleaseTypes[0].name;
        this.crisprAttempt.nucleases.push(nuclease);
      }
    }
    this.dataSource = this.crisprAttempt.nucleases;
  }

  onNucleaseChanged(nuclease: Nuclease) {
    this.convertNumericFields(nuclease);
  }

  showDeleteConfirmationDialog(nuclease: Nuclease) {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '250px',
      data: { confirmed: false }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteNuclease(nuclease);
      }
    });
  }

  deleteNuclease(nuclease: Nuclease) {
    if (this.isNewRecord(nuclease)) {
      this.crisprAttempt.nucleases = this.crisprAttempt.nucleases
        .filter(x => x[this.tmpIndexRowName] !== nuclease[this.tmpIndexRowName]);
    } else {
      this.crisprAttempt.nucleases = this.crisprAttempt.nucleases
        .filter(x => x.id !== nuclease.id);
      this.dataSource = [...this.crisprAttempt.nucleases];
    }
  }

  convertNumericFields(nuclease: Nuclease): void {
    const concentrationAsString = nuclease.concentration ? nuclease.concentration.toString() : '';
    if (concentrationAsString.charAt(concentrationAsString.length - 1) !== '.') {
      nuclease.concentration = this.inputHandlerService.getNumericValueOrNull(nuclease.concentration);
    }
  }

  private isNewRecord(nuclease: Nuclease) {
    return nuclease.id === null;
  }

}
