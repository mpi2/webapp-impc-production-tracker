import { Component, OnInit, Input } from '@angular/core';
import { IntentionByLocation } from 'src/app/core/model/bio/intention-by-location';

@Component({
  selector: 'app-intention-by-location',
  templateUrl: './intention-by-location.component.html',
  styleUrls: ['./intention-by-location.component.css']
})
export class IntentionByLocationComponent implements OnInit {
  @Input() intentionByLocation: IntentionByLocation;

  constructor() { }

  ngOnInit() {
  }

}
