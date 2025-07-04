import {Component, OnInit, Input} from '@angular/core';
import {Mutation} from 'src/app/feature-modules/plans/model/outcomes/mutation';

@Component({
    selector: 'app-targeted-exons',
    templateUrl: './targeted-exons.component.html',
    styleUrls: ['./targeted-exons.component.css'],
    standalone: false
})
export class TargetedExonsComponent implements OnInit {
  @Input() mutation: Mutation;
  @Input() canUpdate: boolean;
  @Input() editCoordinatesChecked: boolean;

  constructor() {
  }

  ngOnInit(): void {
    this.mutation.targetedExons.forEach(exon => {
      exon.transcriptsParsed = exon.transcript
        ? exon.transcript.split(',').map(t => {
          const [name, transcriptId] = t.split('__');
          return { name, transcriptId };
        })
        : [];
    });
  }
}
