import { Component, OnInit, Input } from '@angular/core';
import { IntentionByLocation } from 'src/app/core/model/bio/intention-by-location';

@Component({
  selector: 'app-intention-by-location-list',
  templateUrl: './intention-by-location-list.component.html',
  styleUrls: ['./intention-by-location-list.component.css']
})
export class IntentionByLocationListComponent implements OnInit {

  @Input() intentionByLocations: IntentionByLocation[];

  constructor() { }

  ngOnInit() {
  }

}
