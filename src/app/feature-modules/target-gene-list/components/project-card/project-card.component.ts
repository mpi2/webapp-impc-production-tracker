import { Component, OnInit, Input } from '@angular/core';
import { ProjectByTargetGeneSummary } from 'src/app/model';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.css']
})
export class ProjectCardComponent implements OnInit {
  @Input() project: ProjectByTargetGeneSummary;

  constructor() { }

  ngOnInit() {
  }

}
