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
  preparationTypes: NamedValue[] = [];

  constructor(private configurationDataService: ConfigurationDataService, public dialog: MatDialog) { }

  ngOnInit() {
    this.setFormValues();
    this.setInitialData();
  }

  setFormValues(): void {
    this.configurationDataService.getConfigurationData().subscribe(data => {
      this.configurationData = data;
      this.preparationTypes = this.configurationData.preparationTypes.map(x => ({ name: x }));
    });
  }

  setInitialData(): void {
    this.dataSource = this.crisprAttempt.mutagenesisDonorsAttributes;
    this.setEmptyEditionStatuses();
    this.setOriginalDonors();
  }

  setEmptyEditionStatuses(): void {
    this.crisprAttempt.mutagenesisDonorsAttributes.map(x => this.editionStatusByDonor.set(x.id, ''));
  }

  setOriginalDonors(): void {
    this.originalData = JSON.parse(JSON.stringify(this.crisprAttempt.mutagenesisDonorsAttributes));
  }

  getEditionStatusForDonor(id: number): string {
    return this.editionStatusByDonor.get(id);
  }

  addDonor(): void {
    const donor: Donor = new Donor();
    donor.id = this.nextNewId--;

    this.crisprAttempt.mutagenesisDonorsAttributes.push(donor);
    this.editionStatusByDonor.set(donor.id, 'Created in memory');
    this.dataSource = [...this.crisprAttempt.mutagenesisDonorsAttributes];
  }

  onClickToDeleteElement(donor: Donor): void {
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

  onDonorChanged(donor: Donor): void {
    this.convertNumericFields(donor);
    this.updateRowStatus(donor);
  }

  convertNumericFields(donor: Donor): void {
    const concentrationAsString = donor.concentration ? donor.concentration.toString() : '';
    if (concentrationAsString.charAt(concentrationAsString.length - 1) !== '.') {
      donor.concentration = this.getNumericValueOrNull(donor.concentration);
    }
  }

  updateAllRowsStatus(): void {
    this.crisprAttempt.mutagenesisDonorsAttributes.map(x => this.updateRowStatus(x));
  }

  updateRowStatus(donor: Donor): void {
    const originalDonor = this.originalData.find(x => x.id === donor.id);
    if (originalDonor) {
      if (JSON.stringify(originalDonor) !== JSON.stringify(donor)) {
        this.editionStatusByDonor.set(donor.id, 'Modified in memory');
        console.log(JSON.stringify(originalDonor));
        console.log(JSON.stringify(donor));
      } else {
        this.editionStatusByDonor.set(donor.id, '');
      }
    }
  }

  getNumericValueOrNull(value): number {
    if (!value || isNaN(value) || '' === value) {
      return null;
    }
    return Number(value);
  }

  isElementCreatedOnlyInMemory(donor: Donor): boolean {
    return donor.id < 0;
  }

  deletePrimerInMemory(donor: Donor): void {
    this.crisprAttempt.mutagenesisDonorsAttributes = this.crisprAttempt.mutagenesisDonorsAttributes.filter(x => x.id !== donor.id);
    this.dataSource = [...this.crisprAttempt.mutagenesisDonorsAttributes];
  }

}
