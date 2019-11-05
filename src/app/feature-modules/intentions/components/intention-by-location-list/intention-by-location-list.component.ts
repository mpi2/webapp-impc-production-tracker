import { Component, OnInit, Input } from '@angular/core';
import { ProjectIntention } from 'src/app/model/bio/project-intention';

@Component({
  selector: 'app-intention-by-location-list',
  templateUrl: './intention-by-location-list.component.html',
  styleUrls: ['./intention-by-location-list.component.css']
})
export class IntentionByLocationListComponent implements OnInit {

  @Input() projectIntentions: ProjectIntention[];

  constructor() { }

  ngOnInit() {
  }

}
