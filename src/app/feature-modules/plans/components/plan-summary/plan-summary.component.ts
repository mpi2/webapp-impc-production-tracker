import { Component, Input } from '@angular/core';
import { Plan } from '../../model/plan';

@Component({
    selector: 'app-plan-summary',
    templateUrl: './plan-summary.component.html',
    styleUrls: ['./plan-summary.component.css'],
    standalone: false
})
export class PlanSummaryComponent {

  @Input() plan: Plan;

}
