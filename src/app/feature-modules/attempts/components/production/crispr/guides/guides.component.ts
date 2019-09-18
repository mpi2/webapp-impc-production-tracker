import { Component, OnInit, Input } from '@angular/core';
import { CrisprAttempt } from '../../../..';

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

  constructor() { }

  ngOnInit() {
    this.numOfRows = this.crisprAttempt.guides_attributes.length;
    let sameConcentration = this.isConcentrationTheSameForAllGuides();
    
    this.sameConcentrationForAll = sameConcentration;
  }

  isConcentrationTheSameForAllGuides(): boolean {
    let concentrations = this.crisprAttempt.guides_attributes.filter(x => x['grna_concentration']).map(x => x['grna_concentration']);

    return  concentrations.every(v => v === concentrations[0]);

  }

  onSetIndividualConcentrationsClicked(e) {
    this.sameConcentrationForAll = !e.target.checked;
  }

}
