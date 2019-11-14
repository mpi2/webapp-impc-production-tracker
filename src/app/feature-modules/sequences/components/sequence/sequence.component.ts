import { Component, OnInit, Input } from '@angular/core';
import { Sequence } from 'src/app/model';

@Component({
  selector: 'app-sequence',
  templateUrl: './sequence.component.html',
  styleUrls: ['./sequence.component.css']
})
export class SequenceComponent implements OnInit {
  @Input() sequence: Sequence;

  constructor() { }

  ngOnInit() {
  }

}
