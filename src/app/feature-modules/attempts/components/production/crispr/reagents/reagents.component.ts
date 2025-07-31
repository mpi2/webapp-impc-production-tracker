import { Component, OnInit, Input } from '@angular/core';
import { ConfigurationData, ConfigurationDataService } from 'src/app/core';
import { NamedValue } from 'src/app/core/model/common/named-value';
import { MatDialog } from '@angular/material/dialog';
import { Reagent } from 'src/app/feature-modules/attempts/model/production/crispr/reagent';
import { DeleteConfirmationComponent } from 'src/app/shared/components/delete-confirmation/delete-confirmation.component';
import { InputHandlerService } from 'src/app/core/services/input-handler.service';
import { CrisprAttempt } from 'src/app/feature-modules/attempts/model/production/crispr/crispr-attempt';

@Component({
    selector: 'app-reagents',
    templateUrl: './reagents.component.html',
    styleUrls: ['./reagents.component.css'],
    standalone: false
})
export class ReagentsComponent implements OnInit {
  @Input() crisprAttempt: CrisprAttempt;
  @Input() canUpdatePlan: boolean;

  configurationData: ConfigurationData;
  reagentNames: NamedValue[] = [];

  tmpIndexRowName = 'tmp_id';
  nextNewId = -1;

  constructor(
    private configurationDataService: ConfigurationDataService,
    private inputHandlerService: InputHandlerService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadConfigurationData();
  }

  loadConfigurationData() {
    this.configurationDataService.getConfigurationData().subscribe(data => {
      this.configurationData = data;
      this.reagentNames = this.configurationData.reagents.map(x => ({ name: x }));
    });
  }

  onReagentChanged(reagent: Reagent) {
    reagent.concentration = this.inputHandlerService.getNumericValueOrNull(reagent.concentration);
  }

  addRow() {
    const reagent: Reagent = new Reagent();
    reagent[this.tmpIndexRowName] = this.nextNewId--;
    this.crisprAttempt.reagents.push(reagent);
  }

  onClickToDeleteReagent(reagent: Reagent) {
    if (this.isNewRecord(reagent)) {
      this.deleteReagent(reagent);
    } else {
      this.showDeleteMutationConfirmationDialog(reagent);
    }
  }

  showDeleteMutationConfirmationDialog(reagent: Reagent) {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '250px',
      data: { confirmed: false }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteReagent(reagent);
      }
    });
  }

  deleteReagent(reagent: Reagent) {
    if (this.isNewRecord(reagent)) {
      this.crisprAttempt.reagents = this.crisprAttempt.reagents
        .filter(x => x[this.tmpIndexRowName] !== reagent[this.tmpIndexRowName]);
    } else {
      this.crisprAttempt.reagents = this.crisprAttempt.reagents
        .filter(x => x.id !== reagent.id);
    }

  }

  private isNewRecord(reagent: Reagent) {
    return reagent.id === null;
  }

}
