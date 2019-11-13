import { Component, OnInit, Input } from '@angular/core';
import { ProjectIntention } from 'src/app/model/bio/project-intention';

@Component({
  selector: 'app-intention-by-sequence',
  templateUrl: './intention-by-sequence.component.html',
  styleUrls: ['./intention-by-sequence.component.css']
})
export class IntentionBySequenceComponent implements OnInit {

  @Input() projectIntention: ProjectIntention;

  constructor() { }

  ngOnInit() {
  }

}
