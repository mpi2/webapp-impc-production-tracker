import { Component, OnInit, Inject } from '@angular/core';
import { ChangesHistory } from 'src/app/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
    selector: 'app-update-notification',
    templateUrl: './update-notification.component.html',
    styleUrls: ['./update-notification.component.css'],
    standalone: false
})
export class UpdateNotificationComponent implements OnInit {

  readonly NUMBER_DETAILS_THRESHOLD = 10;

  changeDetails: ChangesHistory;
  showDetails = false;

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {
    this.changeDetails = data;

    if (this.changeDetails.details) {
      this.showDetails = true;
      if (this.changeDetails.details.length < this.NUMBER_DETAILS_THRESHOLD) {
        this.showDetails = true;
        this.removeElementChanged(this.changeDetails);
        this.removeElementAddedNewValue(this.changeDetails);
      } else {
        this.showDetails = false;
      }
    }
  }

  ngOnInit() {

  }

  formatField(field: string) {
    return field.substring(field.lastIndexOf('.') + 1);
  }

  // Remove the records for Element changed because we don't need them here
  removeElementChanged(changeDetails: ChangesHistory) {
    if (changeDetails.details) {
      changeDetails.details = changeDetails.details.filter(x => x.note !== 'Element changed');
    }
  }

  // Remove the records for Element changed because we don't need them here
  removeElementAddedNewValue(changeDetails: ChangesHistory) {
    if (changeDetails.details) {
      changeDetails.details.forEach(x => {
        if (x.note === 'Element added') {
          x.newValue = null;
        }
      });
    }
  }
}
