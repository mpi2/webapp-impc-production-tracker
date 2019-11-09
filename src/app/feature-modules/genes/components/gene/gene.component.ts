import { Component, OnInit, Input } from '@angular/core';
import { Gene } from '../../../../model/bio/gene';

@Component({
  selector: 'app-gene',
  templateUrl: './gene.component.html',
  styleUrls: ['./gene.component.css']
})
export class GeneComponent implements OnInit {

  @Input() gene: Gene;

  constructor() { }

  ngOnInit() {
  }

}
