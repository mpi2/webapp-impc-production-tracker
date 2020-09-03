import { Component, OnInit, Input } from '@angular/core';
import { CrisprAttempt } from 'src/app/feature-modules/attempts';

@Component({
  selector: 'app-injection-details',
  templateUrl: './injection-details.component.html',
  styleUrls: ['./injection-details.component.css']
})
export class InjectionDetailsComponent implements OnInit {
  @Input() crisprAttempt: CrisprAttempt;
  @Input() canUpdatePlan: boolean;

  constructor() { }

  ngOnInit(): void {
    console.log('InjectionDetailsComponent.canUpdatePlan--> ', this.canUpdatePlan);
  }

}
