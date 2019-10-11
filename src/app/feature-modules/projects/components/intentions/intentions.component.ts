import { Component, OnInit, Input } from '@angular/core';
import { Project } from '../../model/project';

@Component({
  selector: 'app-intentions',
  templateUrl: './intentions.component.html',
  styleUrls: ['./intentions.component.css']
})
export class IntentionsComponent implements OnInit {

  @Input() project: Project;

  constructor() { }

  ngOnInit() {
  }

}
