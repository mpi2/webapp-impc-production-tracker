import { Component, OnInit, Input } from '@angular/core';
import { Mutation } from '../../../model/outcomes/mutation';
import { NamedValue } from 'src/app/core/model/common/named-value';
import { ConfigurationDataService, ConfigurationData } from 'src/app/core';
import { QcResult } from '../../../model/outcomes/qc_result';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationComponent } from 'src/app/shared/components/delete-confirmation/delete-confirmation.component';

@Component({
    selector: 'app-qc-results',
    templateUrl: './qc-results.component.html',
    styleUrls: ['./qc-results.component.css'],
    standalone: false
})
export class QcResultsComponent implements OnInit {
  @Input() mutation: Mutation;
  @Input() canUpdate: boolean;

  qcTypes: NamedValue[];
  qcStatuses: NamedValue[];
  configurationData: ConfigurationData;

  tmpIndexRowName = 'tmp_id';
  nextNewId = -1;

  constructor(private configurationDataService: ConfigurationDataService, public dialog: MatDialog) { }

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

  addRow() {
    const qcResult: QcResult = new QcResult();
    qcResult[this.tmpIndexRowName] = this.nextNewId--;
    this.mutation.mutationQcResults.push(qcResult);
  }

  onClickToDelete(qcResult: QcResult) {
    if (this.isNewRecord(qcResult)) {
      this.deleteQcResult(qcResult);
    } else {
      this.showDeleteMutationConfirmationDialog(qcResult);
    }
  }

  showDeleteMutationConfirmationDialog(qcResult: QcResult) {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '250px',
      data: { confirmed: false }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteQcResult(qcResult);
      }
    });
  }

  deleteQcResult(qcResult: QcResult) {
    if (this.isNewRecord(qcResult)) {
      this.mutation.mutationQcResults = this.mutation.mutationQcResults
        .filter(x => x[this.tmpIndexRowName] !== qcResult[this.tmpIndexRowName]);
    } else {
      this.mutation.mutationQcResults = this.mutation.mutationQcResults
        .filter(x => x.id !== qcResult.id);
    }

  }

  private isNewRecord(qcResult: QcResult) {
    return qcResult.id === null;
  }

}
