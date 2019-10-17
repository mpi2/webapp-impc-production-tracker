import { Component, OnInit, Input } from '@angular/core';
import { CrisprAttempt, Guide } from '../../../..';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-guides',
  templateUrl: './guides.component.html',
  styleUrls: ['./guides.component.css']
})
export class GuidesComponent implements OnInit {

  @Input() crisprAttempt: CrisprAttempt;
  @Input() canUpdatePlan: boolean;
  sameConcentrationForAll = true;
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

    this.numOfRows = this.crisprAttempt.guidesAttributes.length;
    const sameConcentration = this.isConcentrationTheSameForAllGuides();
    if (sameConcentration) {
      this.guidesForm.get('groupConcentration').setValue(this.getCommonConcentration());
    }

    this.sameConcentrationForAll = sameConcentration;
  }

  getCommonConcentration(): number {
    let result = null;
    if (this.crisprAttempt.guidesAttributes) {
      const guide = this.crisprAttempt.guidesAttributes[0];
      if (guide) {
        result = guide.grnaConcentration;
      }
    }
    return result;
  }

  isConcentrationTheSameForAllGuides(): boolean {
    const concentrations = this.crisprAttempt.guidesAttributes.filter(x => x.grnaConcentration).map(x => x.grnaConcentration);

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
        this.crisprAttempt.guidesAttributes.map(x => x.grnaConcentration = concentration);
      }
    }
  }

  onIndividualConcentrationChanged(guide: Guide) {
    guide.grnaConcentration = Number(guide.grnaConcentration);
  }

}
