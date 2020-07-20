import { Component, OnInit, Input } from '@angular/core';
import { ProjectIntention } from 'src/app/model';
import { MatDialog } from '@angular/material/dialog';
import { SequencesIntentionsDialogComponent } from '../sequences-intentions-dialog/sequences-intentions-dialog.component';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-intention-list',
  templateUrl: './intention-list.component.html',
  styleUrls: ['./intention-list.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],

})
export class IntentionListComponent implements OnInit {
  @Input() projectIntentions: ProjectIntention[];

  expandedElement: ProjectIntention | null;
  dataSource = this.projectIntentions;

  displayedColumns: string[] = ['molecularMutationType', 'mutationCategorizations', 'geneSymbol', 'accessionId', 'species', 'sequence'];

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openDialog(projectIntention: ProjectIntention): void {
    console.log('projectIntention.intentionsBySequence', projectIntention.intentionsBySequence);

    const dialogRef = this.dialog.open(SequencesIntentionsDialogComponent, {
      width: '100%',
      data: {intentionsBySequence: projectIntention.intentionsBySequence}
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

}
