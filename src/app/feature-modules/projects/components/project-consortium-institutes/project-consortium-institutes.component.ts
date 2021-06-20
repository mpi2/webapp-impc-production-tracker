import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfigurationData, ConfigurationDataService } from 'src/app/core';
import { NamedValue } from 'src/app/core/model/common/named-value';
import { InstitutesConsortium, Project } from 'src/app/model';
import { DeleteConfirmationComponent } from 'src/app/shared/components/delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-project-consortium-institutes',
  templateUrl: './project-consortium-institutes.component.html',
  styleUrls: ['./project-consortium-institutes.component.css']
})
export class ProjectConsortiumInstitutesComponent implements OnInit {
  @Input() project: Project;
  @Input() canUpdate: boolean;

  configurationData: ConfigurationData;
  consortia: NamedValue[];

  tmpIndexRowName = 'tmp_id';
  nextNewId = -1;

  constructor(
    private configurationDataService: ConfigurationDataService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadConfigurationData();
  }

  loadConfigurationData() {
    this.configurationDataService.getConfigurationData().subscribe(data => {
      this.configurationData = data;
      this.consortia = this.configurationData.consortia.map(x => ({ name: x }));
    });
  }

  addRow() {
    const institutesConsortium: InstitutesConsortium = new InstitutesConsortium();
    institutesConsortium[this.tmpIndexRowName] = this.nextNewId--;
    if (!this.project.consortia) {
      this.project.consortia = [];
    }
    this.project.consortia.push(institutesConsortium);
  }

  deleteRow(institutesConsortium: InstitutesConsortium) {
    if (this.isNewRecord(institutesConsortium)) {
      this.deleteConsortia(institutesConsortium);
    } else {
      this.showDeleteConfirmationDialog(institutesConsortium);
    }
  }

  showDeleteConfirmationDialog(institutesConsortium: InstitutesConsortium) {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '250px',
      data: { confirmed: false }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteConsortia(institutesConsortium);
      }
    });
  }

  deleteConsortia(institutesConsortium: InstitutesConsortium) {
    if (this.isNewRecord(institutesConsortium)) {
      this.project.consortia = this.project.consortia
        .filter(x => x[this.tmpIndexRowName] !== institutesConsortium[this.tmpIndexRowName]);
    } else {
      this.project.consortia = this.project.consortia
        .filter(x => x.id !== institutesConsortium.id);
    }

    console.log(this.project.consortia );

  }

  private isNewRecord(institutesConsortium: InstitutesConsortium) {
    return institutesConsortium.id === null;
  }

}
