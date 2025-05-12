import {Component, OnInit, Input} from '@angular/core';
import {Mutation} from 'src/app/feature-modules/plans/model/outcomes/mutation';

@Component({
  selector: 'app-canonical-targeted-exons',
  templateUrl: './canonical-targeted-exons.component.html',
  styleUrls: ['./canonical-targeted-exons.component.css']
})
export class CanonicalTargetedExonsComponent implements OnInit {
  @Input() mutation: Mutation;
  @Input() canUpdate: boolean;

  constructor() {
  }

  ngOnInit(): void {
  }

}
