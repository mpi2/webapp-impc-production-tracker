import { Component, OnInit, Input } from '@angular/core';
import { ProjectIntention } from 'src/app/model/bio/project-intention';

@Component({
  selector: 'app-intention-by-gene-list',
  templateUrl: './intention-by-gene-list.component.html',
  styleUrls: ['./intention-by-gene-list.component.css']
})
export class IntentionByGeneListComponent implements OnInit {

  @Input() projectIntentions: ProjectIntention[];

  constructor() { }

  ngOnInit() {
  }

}
