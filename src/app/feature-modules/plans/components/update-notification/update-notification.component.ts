import { Component, OnInit, Input, Inject } from '@angular/core';
import { ChangesHistory } from 'src/app/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-update-notification',
  templateUrl: './update-notification.component.html',
  styleUrls: ['./update-notification.component.css']
})
export class UpdateNotificationComponent implements OnInit {

  changeDetails: ChangesHistory;

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {
    this.changeDetails = data;
    this.removeElementChanged(this.changeDetails);
  }

  ngOnInit() {

  }

  // Remove the records for Element changed because we don't need them here
  removeElementChanged(changeDetails: ChangesHistory) {
    changeDetails.details = changeDetails.details.filter(x => x.note !== 'Element changed');
  }
}
