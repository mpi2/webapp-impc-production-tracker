import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
    selector: 'app-go-back',
    templateUrl: './go-back.component.html',
    styleUrls: ['./go-back.component.css'],
    standalone: false
})
export class GoBackComponent {

  constructor(private location: Location) { }

  backClicked(): void {
    this.location.back();
  }

}
