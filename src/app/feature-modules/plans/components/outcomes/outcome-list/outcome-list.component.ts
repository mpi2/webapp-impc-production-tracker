import { Component, OnInit, Input } from '@angular/core';
import { Outcome } from '../../../model/outcomes/outcome';

@Component({
  selector: 'app-outcome-list',
  templateUrl: './outcome-list.component.html',
  styleUrls: ['./outcome-list.component.css']
})
export class OutcomeListComponent implements OnInit {
  @Input() outcomes: Outcome[];

  constructor() { }

  ngOnInit(): void {
  }

}
