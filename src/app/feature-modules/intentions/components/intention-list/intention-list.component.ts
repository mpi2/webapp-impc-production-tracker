import { Component, OnInit, Input } from '@angular/core';
import { ProjectIntention } from 'src/app/model';
import { MatDialog } from '@angular/material/dialog';
import { SequencesIntentionsDialogComponent } from '../sequences-intentions-dialog/sequences-intentions-dialog.component';

@Component({
  selector: 'app-intention-list',
  templateUrl: './intention-list.component.html',
  styleUrls: ['./intention-list.component.css']

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
