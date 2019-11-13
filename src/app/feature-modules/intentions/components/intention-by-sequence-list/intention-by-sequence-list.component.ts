import { Component, OnInit, Input } from '@angular/core';
import { ProjectIntention } from 'src/app/model/bio/project-intention';

@Component({
  selector: 'app-intention-by-sequence-list',
  templateUrl: './intention-by-sequence-list.component.html',
  styleUrls: ['./intention-by-sequence-list.component.css']
})
export class IntentionBySequenceListComponent implements OnInit {

  @Input() projectIntentions: ProjectIntention[];

  constructor() { }

  ngOnInit() {
  }

}
