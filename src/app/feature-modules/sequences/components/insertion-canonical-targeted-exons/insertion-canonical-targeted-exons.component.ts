import {Component, OnInit, Input} from '@angular/core';
import {InsertionSequence} from "../../model/insertionSequence";

@Component({
    selector: 'app-insertion-canonical-targeted-exons',
    templateUrl: './insertion-canonical-targeted-exons.component.html',
    styleUrls: ['./insertion-canonical-targeted-exons.component.css'],
    standalone: false
})
export class InsertionCanonicalTargetedExonsComponent implements OnInit {
  @Input() insertionSequence: InsertionSequence;
  constructor() {
  }


  ngOnInit(): void {
    this.insertionSequence.insertionCanonicalTargetedExons.forEach(exon => {
      exon.transcriptsParsed = exon.transcript
        ? exon.transcript.split(',').map(t => {
          const [name, transcriptId] = t.split('__');
          return { name, transcriptId };
        })
        : [];
    });
  }
}
