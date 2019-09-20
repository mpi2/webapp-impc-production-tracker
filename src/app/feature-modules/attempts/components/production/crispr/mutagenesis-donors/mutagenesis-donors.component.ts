import { Component, OnInit, Input } from '@angular/core';
import { CrisprAttempt } from '../../../..';
import { Donor } from 'src/app/feature-modules/attempts/model/production/crispr/donor';

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

  constructor() { }

  ngOnInit() {
    this.setInitialData();
  }

  setInitialData() {
    this.dataSource = this.crisprAttempt.mutagenesis_donors_attributes;
    this.setEmptyEditionStatuses();
    this.setOriginalPrimers();
  }

  setEmptyEditionStatuses() {
    this.crisprAttempt.mutagenesis_donors_attributes.map(x => this.editionStatusByDonor.set(x.id, ''));
  }

  setOriginalPrimers() {
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

  onClickToDeleteElement(donor) {
    alert('No implemented yet');
  }

}
