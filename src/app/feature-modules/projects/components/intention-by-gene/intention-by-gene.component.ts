import { Component, OnInit, Input } from '@angular/core';
import { IntentionByGene } from '../..';

@Component({
  selector: 'app-intention-by-gene',
  templateUrl: './intention-by-gene.component.html',
  styleUrls: ['./intention-by-gene.component.css']
})
export class IntentionByGeneComponent implements OnInit {
  
  @Input() intentionByGene: IntentionByGene;

  constructor() { }

  ngOnInit() {
  }

}
