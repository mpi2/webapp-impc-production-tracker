import { Component, OnInit, Input } from '@angular/core';
import { Colony } from '../../../model/outcomes/colony';

@Component({
    selector: 'app-colony-summary',
    templateUrl: './colony-summary.component.html',
    styleUrls: ['./colony-summary.component.css'],
    standalone: false
})
export class ColonySummaryComponent implements OnInit {
  @Input() colony: Colony;

  constructor() { }

  ngOnInit(): void {
  }
}
