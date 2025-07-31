import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Donor } from 'src/app/feature-modules/attempts/model/production/crispr/donor';
import { ConfigurationDataService, ConfigurationData } from 'src/app/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationComponent } from 'src/app/shared/components/delete-confirmation/delete-confirmation.component';
import { NamedValue } from 'src/app/core/model/common/named-value';
import { CrisprAttempt } from 'src/app/feature-modules/attempts/model/production/crispr/crispr-attempt';


@Component({
    selector: 'app-mutagenesis-donors',
    templateUrl: './mutagenesis-donors.component.html',
    styleUrls: ['./mutagenesis-donors.component.css'],
    standalone: false
})
export class MutagenesisDonorsComponent implements OnInit, OnChanges {

  @Input() crisprAttempt: CrisprAttempt;
  @Input() canUpdatePlan: boolean;

  dataSource: Donor[];
  originalData: Donor[];
  nextNewId = -1;
  configurationData: ConfigurationData;
  preparationTypes: NamedValue[] = [];

  constructor(
    private configurationDataService: ConfigurationDataService,
    public dialog: MatDialog) { }

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
    this.dataSource = this.crisprAttempt.mutagenesisDonors;
    this.setOriginalDonors();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.crisprAttempt) {
      this.crisprAttempt = changes.crisprAttempt.currentValue;
      this.setInitialData();
    }
  }

  setOriginalDonors(): void {
    this.originalData = JSON.parse(JSON.stringify(this.crisprAttempt.mutagenesisDonors));
  }

  addDonor(): void {
    const donor: Donor = new Donor();
    donor.id = this.nextNewId--;
    this.crisprAttempt.mutagenesisDonors.push(donor);
    this.dataSource = [...this.crisprAttempt.mutagenesisDonors];
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
    this.setEmptyValuesToNull(donor);
  }

  convertNumericFields(donor: Donor): void {
    const concentrationAsString = donor.concentration ? donor.concentration.toString() : '';
    if (concentrationAsString.charAt(concentrationAsString.length - 1) !== '.') {
      donor.concentration = this.getNumericValueOrNull(donor.concentration);
    }
  }

  setEmptyValuesToNull(donor: Donor): void {
    donor.oligoSequenceFasta = this.getValueOrNull(donor.oligoSequenceFasta);
  }

  getValueOrNull(value) {
    if (!value || '' === value) {
      return null;
    }
    return value;
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
    this.crisprAttempt.mutagenesisDonors = this.crisprAttempt.mutagenesisDonors.filter(x => x.id !== donor.id);
    this.dataSource = [...this.crisprAttempt.mutagenesisDonors];
  }

}
