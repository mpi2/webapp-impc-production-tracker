import {Component, OnInit, Input} from '@angular/core';
import {Mutation} from 'src/app/feature-modules/plans/model/outcomes/mutation';

@Component({
  selector: 'app-targeted-exons',
  templateUrl: './targeted-exons.component.html',
  styleUrls: ['./targeted-exons.component.css']
})
export class TargetedExonsComponent implements OnInit {
  @Input() mutation: Mutation;
  @Input() canUpdate: boolean;

  constructor() {
  }

  ngOnInit(): void {
  }

}
