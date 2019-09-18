import { Component, OnInit, Input, Inject } from '@angular/core';
import { TissueDistributionCentre, PhenotypingAttempt } from '../../../model/phenotyping/phenotyping_attempt';
import { ConfigurationDataService, ConfigurationData } from 'src/app/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DeleteConfirmationComponent } from 'src/app/shared/components/delete-confirmation/delete-confirmation.component';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-tissue-distribution-centre',
  templateUrl: './tissue-distribution-centre.component.html',
  styleUrls: ['./tissue-distribution-centre.component.css']
})
export class TissueDistributionCentreComponent implements OnInit {

  @Input() phenotypingAttempt: PhenotypingAttempt;
  @Input() canUpdatePlan: boolean;
  configurationData: ConfigurationData;
  materialTypes: any[];
  workUnits: any[];

  animal: string;
  name: string;
  confirmed: string;

  constructor(private configurationDataService: ConfigurationDataService, public dialog: MatDialog) { }

  ngOnInit() {
    this.configurationData = this.configurationDataService.getConfigurationInfo();

    this.materialTypes = this.configurationData.materialTypes;
    this.workUnits = this.configurationData.workUnits;
  }
  onDeleteElement(e) {
    console.log('delete', e);

  }

  onClickToDeleteElement(element): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '250px',
      data: { confirmed: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Delete element confirmed');
        console.log('delete', element);
        this.deleteTissueDistributionCentre(element);
      }
    });
  }

  deleteTissueDistributionCentre(e: TissueDistributionCentre) {
    console.log('Delete TissueDistributionCentre ', e);
    
  }
  onDateChanged() {
    console.log('To be implemented');
    
  }


}
