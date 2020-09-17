import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CrisprAttempt } from 'src/app/feature-modules/attempts/model/production/crispr/crispr-attempt';
import { Guide } from 'src/app/feature-modules/attempts';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationComponent } from 'src/app/shared/components/delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-guides',
  templateUrl: './guides.component.html',
  styleUrls: ['./guides.component.css']
})
export class GuidesComponent implements OnInit {

  @Input() crisprAttempt: CrisprAttempt;
  @Input() canUpdatePlan: boolean;
  sameConcentrationForAll = true;
  guidesForm: FormGroup;
  concentrationForm: FormGroup;

  tmpIndexRowName = 'tmp_id';
  nextNewId = -1;

  constructor(private formBuilder: FormBuilder, public dialog: MatDialog) { }

  ngOnInit() {
    this.guidesForm = this.formBuilder.group({
      groupConcentration: [''],
    });
    this.concentrationForm = this.formBuilder.group({
    });

    const sameConcentration = this.isConcentrationTheSameForAllGuides();
    if (sameConcentration) {
      this.guidesForm.get('groupConcentration').setValue(this.getCommonConcentration());
    }

    this.sameConcentrationForAll = sameConcentration;
  }

  getCommonConcentration(): number {
    let result = null;
    if (this.crisprAttempt.guides) {
      const guide = this.crisprAttempt.guides[0];
      if (guide) {
        result = guide.grnaConcentration;
      }
    }
    return result;
  }

  isConcentrationTheSameForAllGuides(): boolean {
    const concentrations = this.crisprAttempt.guides.filter(x => x.grnaConcentration).map(x => x.grnaConcentration);

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
        this.crisprAttempt.guides.map(x => x.grnaConcentration = concentration);
      }
    }
  }

  onIndividualConcentrationChanged(guide: Guide) {
    guide.grnaConcentration = Number(guide.grnaConcentration);
  }

  addRow() {
    const guide: Guide = new Guide();
    guide[this.tmpIndexRowName] = this.nextNewId--;
    this.crisprAttempt.guides.push(guide);
  }

  deleteRow(guide: Guide) {
    if (this.isNewRecord(guide)) {
      this.deleteGuide(guide);
    } else {
      this.showDeleteConfirmationDialog(guide);
    }
  }

  showDeleteConfirmationDialog(guide: Guide) {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '250px',
      data: { confirmed: false }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteGuide(guide);
      }
    });
  }

  deleteGuide(guide: Guide) {
    if (this.isNewRecord(guide)) {
      this.crisprAttempt.guides = this.crisprAttempt.guides
        .filter(x => x[this.tmpIndexRowName] !== guide[this.tmpIndexRowName]);
    } else {
      this.crisprAttempt.guides = this.crisprAttempt.guides
        .filter(x => x.id !== guide.id);
    }
  }

  private isNewRecord(guide: Guide) {
    return guide.id == null;
  }

}
