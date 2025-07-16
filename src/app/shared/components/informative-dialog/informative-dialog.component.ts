import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface Message {
  title: string;
  text: string;
}

@Component({
    selector: 'app-informative-dialog',
    templateUrl: './informative-dialog.component.html',
    styleUrls: ['./informative-dialog.component.css'],
    standalone: false
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
