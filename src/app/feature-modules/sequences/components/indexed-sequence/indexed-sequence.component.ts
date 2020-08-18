import { Component, OnInit, Input } from '@angular/core';
import { IndexedSequence } from '../../model/indexed-sequence';

@Component({
  selector: 'app-indexed-sequence',
  templateUrl: './indexed-sequence.component.html',
  styleUrls: ['./indexed-sequence.component.css']
})
export class IndexedSequenceComponent implements OnInit {
  @Input() indexedSequence: IndexedSequence;

  constructor() { }

  ngOnInit(): void {
  }

}
