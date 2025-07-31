import { Component, OnInit, Input } from '@angular/core';
import { TissueDistributionCentre } from '../../../model/phenotyping/phenotyping_attempt';
import { ConfigurationDataService, ConfigurationData } from 'src/app/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationComponent } from 'src/app/shared/components/delete-confirmation/delete-confirmation.component';
import { PhenotypingStage } from '../../../model/phenotyping/phenotyping-stage';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
    selector: 'app-tissue-distribution-centre',
    templateUrl: './tissue-distribution-centre.component.html',
    styleUrls: ['./tissue-distribution-centre.component.css'],
    standalone: false
})
export class TissueDistributionCentreComponent implements OnInit {

  @Input() phenotypingStage: PhenotypingStage;
  @Input() canUpdatePlan: boolean;

  configurationData: ConfigurationData;
  materialTypes: any[];
  workUnits: any[];

  animal: string;
  name: string;
  confirmed: string;

  tmpIndexRowName = 'tmp_id';
  nextNewId = -1;

  constructor(private configurationDataService: ConfigurationDataService, public dialog: MatDialog) { }

  ngOnInit() {
    this.configurationDataService.getConfigurationData().subscribe(data => {
      this.configurationData = data;
      this.materialTypes = this.configurationData.materialTypes;
      this.workUnits = this.configurationData.workUnits;
    });

  }

  onClickToDelete(tissueDistributionCentre: TissueDistributionCentre) {
    if (this.isNewRecord(tissueDistributionCentre)) {
      this.deleteTissueDistributionCentre(tissueDistributionCentre);
    } else {
      this.showDeleteMutationConfirmationDialog(tissueDistributionCentre);
    }
  }

  showDeleteMutationConfirmationDialog(tissueDistributionCentre: TissueDistributionCentre) {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '250px',
      data: { confirmed: false }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteTissueDistributionCentre(tissueDistributionCentre);
      }
    });
  }

  deleteTissueDistributionCentre(tissueDistributionCentre: TissueDistributionCentre) {
    if (this.isNewRecord(tissueDistributionCentre)) {
      this.phenotypingStage.tissueDistributions = this.phenotypingStage.tissueDistributions
        .filter(x => x[this.tmpIndexRowName] !== tissueDistributionCentre[this.tmpIndexRowName]);
    } else {
      this.phenotypingStage.tissueDistributions = this.phenotypingStage.tissueDistributions
        .filter(x => x.id !== tissueDistributionCentre.id);
    }

  }

  addRow() {
    const tissueDistributionCentre: TissueDistributionCentre = new TissueDistributionCentre();
    tissueDistributionCentre[this.tmpIndexRowName] = this.nextNewId--;
    this.phenotypingStage.tissueDistributions.push(tissueDistributionCentre);
  }

  private isNewRecord(tissueDistributionCentre: TissueDistributionCentre) {
    return tissueDistributionCentre.id === null;
  }

}
