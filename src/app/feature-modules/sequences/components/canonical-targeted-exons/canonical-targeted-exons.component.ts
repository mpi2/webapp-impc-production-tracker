import {Component, OnInit, Input} from '@angular/core';
import {Mutation} from 'src/app/feature-modules/plans/model/outcomes/mutation';

@Component({
    selector: 'app-canonical-targeted-exons',
    templateUrl: './canonical-targeted-exons.component.html',
    styleUrls: ['./canonical-targeted-exons.component.css'],
    standalone: false
})
export class CanonicalTargetedExonsComponent implements OnInit {
  @Input() mutation: Mutation;
  constructor() {
  }


  ngOnInit(): void {
    this.mutation.canonicalTargetedExons.forEach(exon => {
      exon.transcriptsParsed = exon.transcript
        ? exon.transcript.split(',').map(t => {
          const [name, transcriptId] = t.split('__');
          return { name, transcriptId };
        })
        : [];
    });
  }
}
