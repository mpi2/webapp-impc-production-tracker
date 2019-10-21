import { Component, OnInit, Input } from '@angular/core';
import { Location} from 'src/app/feature-modules/locations/model/location';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements OnInit {
  @Input() location: Location;

  constructor() { }

  ngOnInit() {
    console.log('LocationComponent location: ', this.location);

  }

}
