import { Component, OnInit, Input } from '@angular/core';
import { CrisprAttempt } from '../../..';

@Component({
  selector: 'app-mutagenesis-donors',
  templateUrl: './mutagenesis-donors.component.html',
  styleUrls: ['./mutagenesis-donors.component.css']
})
export class MutagenesisDonorsComponent implements OnInit {

  @Input() crisprAttempt: CrisprAttempt;
  @Input() canUpdatePlan: boolean;

  constructor() { }

  ngOnInit() {
  }

}
