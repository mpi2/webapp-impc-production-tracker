import { Component, OnInit, Inject } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';

interface Message {
  title: string;
  text: string;
}

@Component({
  selector: 'app-informative-dialog',
  templateUrl: './informative-dialog.component.html',
  styleUrls: ['./informative-dialog.component.css']
})
export class InformativeDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<InformativeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Message) {}

  ngOnInit() {
  }

  onOkClick(): void {
    this.dialogRef.close();
  }

}
