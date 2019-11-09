import { Component, OnInit, Input } from '@angular/core';
import { ProjectIntention } from 'src/app/model/bio/project-intention';

@Component({
  selector: 'app-intention-by-location',
  templateUrl: './intention-by-location.component.html',
  styleUrls: ['./intention-by-location.component.css']
})
export class IntentionByLocationComponent implements OnInit {

  @Input() projectIntention: ProjectIntention;

  constructor() { }

  ngOnInit() {
  }

}
