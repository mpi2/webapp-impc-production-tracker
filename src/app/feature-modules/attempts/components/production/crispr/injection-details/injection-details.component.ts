import { Component, OnInit, Input } from '@angular/core';
import { CrisprAttempt } from 'src/app/feature-modules/attempts/model/production/crispr/crispr-attempt';

@Component({
    selector: 'app-injection-details',
    templateUrl: './injection-details.component.html',
    styleUrls: ['./injection-details.component.css'],
    standalone: false
})
export class InjectionDetailsComponent implements OnInit {
  @Input() crisprAttempt: CrisprAttempt;
  @Input() canUpdatePlan: boolean;

  transferDays = ['Same Day', 'Next Day'];

  constructor() { }

  ngOnInit(): void {
  }

}
