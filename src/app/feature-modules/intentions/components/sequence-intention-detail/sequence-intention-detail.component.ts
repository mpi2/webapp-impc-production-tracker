import { Component, OnInit, Input } from '@angular/core';
import { IntentionBySequence } from 'src/app/model';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-sequence-intention-detail',
    templateUrl: './sequence-intention-detail.component.html',
    styleUrls: ['./sequence-intention-detail.component.css'],
    standalone: false
})
export class SequenceIntentionDetailComponent implements OnInit {
  @Input() intentionBySequence: IntentionBySequence;

  sequenceIntentionDetailForm: FormGroup;
  displayedColumns: string[] = ['index', 'chr', 'start', 'stop', 'strand', 'genomeBuild', 'strain', 'species'];

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.sequenceIntentionDetailForm = this.formBuilder.group({
      sequence: [this.intentionBySequence.sequence.sequence],
    });
  }

}
