import { Component, OnInit, Input } from '@angular/core';
import { IntentionByGene } from '../../../../core/model/bio/intention-by-gene';

@Component({
  selector: 'app-intention-by-gene-list',
  templateUrl: './intention-by-gene-list.component.html',
  styleUrls: ['./intention-by-gene-list.component.css']
})
export class IntentionByGeneListComponent implements OnInit {

  @Input() intentionByGenes: IntentionByGene[];

  constructor() { }

  ngOnInit() {
    console.log('intentionByGenes->', this.intentionByGenes);
  }

}
