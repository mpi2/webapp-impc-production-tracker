import { Component, OnInit, Input } from '@angular/core';
import { ProjectIntention } from 'src/app/model';

@Component({
  selector: 'app-intention-list',
  templateUrl: './intention-list.component.html',
  styleUrls: ['./intention-list.component.css']
})
export class IntentionListComponent implements OnInit {
  @Input() projectIntentions: ProjectIntention[];

  displayedColumns: string[] = ['molecularMutationType', 'mutationCategorizations', 'geneSymbol', 'accessionId', 'species', 'sequence'];

  constructor() { }

  ngOnInit(): void {
  }

}
