import { Component, OnInit, Input } from '@angular/core';
import { CrisprAttempt } from '../../../..';

@Component({
  selector: 'app-genotype-primers',
  templateUrl: './genotype-primers.component.html',
  styleUrls: ['./genotype-primers.component.css']
})
export class GenotypePrimersComponent implements OnInit {

  @Input() crisprAttempt: CrisprAttempt;
  @Input() canUpdatePlan: boolean;
  displayedColumns: string[] = [ 'name', 'sequence', 'startCoordinate', 'endCoordinate'];

  constructor() { }

  ngOnInit() {
  }

}
