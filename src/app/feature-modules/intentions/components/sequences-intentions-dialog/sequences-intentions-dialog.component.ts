import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-intention-detail-dialog',
  templateUrl: './sequences-intentions-dialog.component.html',
  styleUrls: ['./sequences-intentions-dialog.component.css']
})
export class SequencesIntentionsDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<SequencesIntentionsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data) { }

}
