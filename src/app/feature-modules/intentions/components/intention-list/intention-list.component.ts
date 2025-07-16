import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ProjectIntention } from 'src/app/feature-modules/projects';

@Component({
    selector: 'app-intention-list',
    templateUrl: './intention-list.component.html',
    styleUrls: ['./intention-list.component.css'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
    standalone: false
})
export class IntentionListComponent implements OnInit {
  @Input() projectIntentions: ProjectIntention[];

  expandedElement: ProjectIntention | null;

  displayedColumns: string[] = ['molecularMutationType', 'mutationCategorizations', 'geneSymbol', 'accessionId', 'sequence'];

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

}
