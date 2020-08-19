import { Component, OnInit, Input } from '@angular/core';
import { IndexedSequence } from '../../model/indexed-sequence';

@Component({
  selector: 'app-indexed-locations',
  templateUrl: './indexed-locations.component.html',
  styleUrls: ['./indexed-locations.component.css']
})
export class IndexedLocationsComponent implements OnInit {
  @Input() indexedSequence: IndexedSequence;

  displayedColumns: string[] = ['index', 'chr', 'start', 'stop', 'strand', 'genomeBuild', 'strain', 'species'];

  constructor() { }

  ngOnInit(): void {
    console.log('IndexedLocationsComponent', this.indexedSequence);

  }

}
