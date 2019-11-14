import { Component, OnInit, Input } from '@angular/core';
import { ProjectIntention } from 'src/app/model/bio/project-intention';

@Component({
  selector: 'app-intention-by-gene',
  templateUrl: './intention-by-gene.component.html',
  styleUrls: ['./intention-by-gene.component.css']
})
export class IntentionByGeneComponent implements OnInit {

  @Input() projectIntention: ProjectIntention;

  constructor() { }

  ngOnInit() {
  }

}
