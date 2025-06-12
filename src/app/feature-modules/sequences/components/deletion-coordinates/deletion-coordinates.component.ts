import {Component, OnInit, Input} from '@angular/core';
import {Mutation} from 'src/app/feature-modules/plans/model/outcomes/mutation';

@Component({
  selector: 'app-deletion-coordinates',
  templateUrl: './deletion-coordinates.component.html',
  styleUrls: ['./deletion-coordinates.component.css']
})
export class DeletionCoordinatesComponent implements OnInit {
  @Input() mutation: Mutation;
  @Input() canUpdate: boolean;
  @Input() editCoordinatesChecked: boolean;
  constructor() {
  }

  ngOnInit(): void {
    console.log(this.mutation)
  }

}
