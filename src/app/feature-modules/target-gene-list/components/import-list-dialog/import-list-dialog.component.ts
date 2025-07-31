import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-import-list-dialog',
    templateUrl: './import-list-dialog.component.html',
    styleUrls: ['./import-list-dialog.component.css'],
    standalone: false
})
export class ImportListDialogComponent implements OnInit {

  public csvRecords: any[];

  constructor(
    public dialogRef: MatDialogRef<ImportListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit() {
  }

  setFile(e) {
    this.dialogRef.close(e);
  }

  onCancelClick() {
    this.dialogRef.close();
  }
}
