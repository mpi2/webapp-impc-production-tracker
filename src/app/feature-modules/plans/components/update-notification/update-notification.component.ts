import { Component, OnInit, Input, Inject } from '@angular/core';
import { ChangesHistory } from 'src/app/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material';

@Component({
  selector: 'app-update-notification',
  templateUrl: './update-notification.component.html',
  styleUrls: ['./update-notification.component.css']
})
export class UpdateNotificationComponent implements OnInit {

  private changeDetails: ChangesHistory;

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {
    this.changeDetails = data;
  }

  ngOnInit() {

  }
}
