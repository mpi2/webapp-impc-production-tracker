import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-coordinates-edit-confirmation',
    templateUrl: './coordinates-edit-confirmation.component.html',
    styleUrls: ['./coordinates-edit-confirmation.component.css'],
    standalone: false
})
export class CoordinatesEditConfirmationComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<CoordinatesEditConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.data.confirmed = true;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
