import {Component, OnInit, Input} from '@angular/core';
import {InsertionSequence} from "../../model/insertionSequence";

@Component({
    selector: 'app-insertion-targeted-exons',
    templateUrl: './insertion-targeted-exons.component.html',
    styleUrls: ['./insertion-targeted-exons.component.css'],
    standalone: false
})
export class InsertionTargetedExonsComponent implements OnInit {
  @Input() insertionSequence: InsertionSequence;
  constructor() {
  }


  ngOnInit(): void {
    this.insertionSequence.insertionTargetedExons.forEach(exon => {
      exon.transcriptsParsed = exon.transcript
        ? exon.transcript.split(',').map(t => {
          const [name, transcriptId] = t.split('__');
          return { name, transcriptId };
        })
        : [];
    });
  }
}
