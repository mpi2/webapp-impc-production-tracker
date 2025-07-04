import { Component, OnInit, Input } from '@angular/core';
import { Outcome } from '../../../model/outcomes/outcome';

@Component({
    selector: 'app-outcome-list',
    templateUrl: './outcome-list.component.html',
    styleUrls: ['./outcome-list.component.css'],
    standalone: false
})
export class OutcomeListComponent implements OnInit {
  @Input() outcomes: Outcome[];
  @Input() canUpdate: boolean;
  @Input() tpn: string;
  @Input() pin: string;
  @Input() attemptType: string;

  constructor() { }

  ngOnInit(): void {
  }

}
