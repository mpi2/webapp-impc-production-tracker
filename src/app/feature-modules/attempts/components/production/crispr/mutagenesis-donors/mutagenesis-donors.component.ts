import { Component, OnInit, Input } from '@angular/core';
import { CrisprAttempt } from '../../../..';
import { Donor } from 'src/app/feature-modules/attempts/model/production/crispr/donor';
import { ConfigurationDataService, ConfigurationData } from 'src/app/core';
import { MatDialog } from '@angular/material';
import { DeleteConfirmationComponent } from 'src/app/shared/components/delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-mutagenesis-donors',
  templateUrl: './mutagenesis-donors.component.html',
  styleUrls: ['./mutagenesis-donors.component.css']
})
export class MutagenesisDonorsComponent implements OnInit {

  @Input() crisprAttempt: CrisprAttempt;
  @Input() canUpdatePlan: boolean;

  dataSource: Donor[];
  originalData: Donor[];
  editionStatusByDonor = new Map<number, string>();
  nextNewId = -1;
  configurationData: ConfigurationData;
  preparationTypes: any[] = [];

  constructor(private configurationDataService: ConfigurationDataService, public dialog: MatDialog,) { }

  ngOnInit() {
    this.setFormValues();
    this.setInitialData();
  }

  setFormValues() {
    this.configurationData = this.configurationDataService.getConfigurationInfo();
    this.preparationTypes = this.configurationData.preparationTypes.map(x => { return { name: x } });
  }

  setInitialData() {
    this.dataSource = this.crisprAttempt.mutagenesis_donors_attributes;
    this.setEmptyEditionStatuses();
    this.setOriginalDonors();
  }

  setEmptyEditionStatuses() {
    this.crisprAttempt.mutagenesis_donors_attributes.map(x => this.editionStatusByDonor.set(x.id, ''));
  }

  setOriginalDonors() {
    this.originalData = JSON.parse(JSON.stringify(this.crisprAttempt.mutagenesis_donors_attributes));
  }

  getEditionStatusForDonor(id: number): string {
    return this.editionStatusByDonor.get(id);
  }

  addDonor() {
    let donor: Donor = new Donor();
    donor.id = this.nextNewId--;

    this.crisprAttempt.mutagenesis_donors_attributes.push(donor);
    this.editionStatusByDonor.set(donor.id, 'Created in memory');
    this.dataSource = [...this.crisprAttempt.mutagenesis_donors_attributes];
  }

  onClickToDeleteElement(donor: Donor) {
    if (this.isElementCreatedOnlyInMemory(donor)) {
      this.deletePrimerInMemory(donor);
    } else {
      const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
        width: '250px',
        data: { confirmed: false }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.deletePrimerInMemory(donor);
        }
      });
    }
  }

  onDonorChanged(donor: Donor) {
    this.convertNumericFields(donor);
    this.updateRowStatus(donor);
  }

  convertNumericFields(donor: Donor) {
    let concentrationAsString = donor.concentration ? donor.concentration.toString() : '';
    if (concentrationAsString.charAt(concentrationAsString.length -1) != '.') {
      donor.concentration = this.getNumericValueOrNull(donor.concentration);
    }
  }

  updateAllRowsStatus() {
    this.crisprAttempt.mutagenesis_donors_attributes.map(x => this.updateRowStatus(x));
  }

  updateRowStatus(donor: Donor) {
    let originalDonor = this.originalData.find(x => x.id === donor.id);
    if (originalDonor) {
      if (JSON.stringify(originalDonor) != JSON.stringify(donor)) {
        this.editionStatusByDonor.set(donor.id, 'Modified in memory');
        console.log(JSON.stringify(originalDonor));
        console.log(JSON.stringify(donor));
      }
      else {
        this.editionStatusByDonor.set(donor.id, '');
      }
    }
  }

  getNumericValueOrNull(value) {
    if (!value || isNaN(value) || '' === value) {
      return null;
    }
    return Number(value)
  }

  isElementCreatedOnlyInMemory(donor: Donor): boolean {
    return donor.id < 0;
  }

  deletePrimerInMemory(donor: Donor) {
    this.crisprAttempt.mutagenesis_donors_attributes = this.crisprAttempt.mutagenesis_donors_attributes.filter(x => x.id != donor.id);
    this.dataSource = [...this.crisprAttempt.mutagenesis_donors_attributes];
  }

}
