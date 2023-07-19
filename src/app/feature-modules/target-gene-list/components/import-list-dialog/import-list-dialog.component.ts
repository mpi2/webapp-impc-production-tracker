import { Component, OnInit, Inject } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-import-list-dialog',
  templateUrl: './import-list-dialog.component.html',
  styleUrls: ['./import-list-dialog.component.css']
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
