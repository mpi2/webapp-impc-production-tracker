import { Component, OnInit, Input } from '@angular/core';
import { IndexedSequence } from '../../model/indexed-sequence';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-indexed-sequence',
  templateUrl: './indexed-sequence.component.html',
  styleUrls: ['./indexed-sequence.component.css']
})
export class IndexedSequenceComponent implements OnInit {
  @Input() indexedSequence: IndexedSequence;

  indexedSequenceForm: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.indexedSequence = new IndexedSequence();

    this.indexedSequenceForm = this.formBuilder.group({
      sequence: [this.indexedSequence.sequence],
    });
  }

}
