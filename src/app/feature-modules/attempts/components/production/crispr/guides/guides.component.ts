import { Component, OnInit, Input } from '@angular/core';
import { CrisprAttempt, Guide } from '../../../..';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GenotypePrimer } from 'src/app/feature-modules/attempts/model/production/crispr/genotype-primer';

@Component({
  selector: 'app-guides',
  templateUrl: './guides.component.html',
  styleUrls: ['./guides.component.css']
})
export class GuidesComponent implements OnInit {

  @Input() crisprAttempt: CrisprAttempt;
  @Input() canUpdatePlan: boolean;
  sameConcentrationForAll: boolean = true;
  numOfRows: number;
  guidesForm: FormGroup;
  concentrationForm: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.guidesForm = this.formBuilder.group({
      groupConcentration: [''],
    });
    this.concentrationForm = this.formBuilder.group({
    });

    this.numOfRows = this.crisprAttempt.guides_attributes.length;
    let sameConcentration = this.isConcentrationTheSameForAllGuides();
    if (sameConcentration) {
      this.guidesForm.get('groupConcentration').setValue(this.getCommonConcentration());
    }

    this.sameConcentrationForAll = sameConcentration;
  }

  getCommonConcentration(): number {
    let result = null;
    if (this.crisprAttempt.guides_attributes) {
      let guide = this.crisprAttempt.guides_attributes[0];
      if (guide) {
        result = guide.grna_concentration;
      }
    }
    return result;
  }

  isConcentrationTheSameForAllGuides(): boolean {
    let concentrations = this.crisprAttempt.guides_attributes.filter(x => x['grna_concentration']).map(x => x['grna_concentration']);

    return concentrations.every(v => v === concentrations[0]);
  }

  onSetIndividualConcentrationsClicked(e) {
    this.sameConcentrationForAll = !e.target.checked;
  }

  onGroupConcentrationChanged() {
    const groupConcentrationText = this.guidesForm.get('groupConcentration').value;
    if (groupConcentrationText) {
      const concentration = Number(groupConcentrationText);
      if (concentration) {
        this.crisprAttempt.guides_attributes.map(x => x.grna_concentration = concentration);
      }
    }
  }

  onIndividualConcentrationChanged(guide: Guide) {
    guide.grna_concentration = Number(guide.grna_concentration);
  }

}
