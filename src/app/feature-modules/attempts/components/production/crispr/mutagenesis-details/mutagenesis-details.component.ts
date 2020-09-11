import { Component, OnInit, Input } from '@angular/core';
import { CrisprAttempt } from 'src/app/feature-modules/attempts/model/production/crispr/crispr-attempt';

@Component({
  selector: 'app-mutagenesis-details',
  templateUrl: './mutagenesis-details.component.html',
  styleUrls: ['./mutagenesis-details.component.css']
})
export class MutagenesisDetailsComponent implements OnInit {

  @Input() crisprAttempt: CrisprAttempt;
  @Input() canUpdatePlan: boolean;

  constructor() { }

  ngOnInit() {
  }

}
