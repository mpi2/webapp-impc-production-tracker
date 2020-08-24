import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IndexedSequence } from '../../model/indexed-sequence';
import { ConfigurationDataService, ConfigurationData } from 'src/app/core';
import { NamedValue } from 'src/app/core/model/common/named-value';

@Component({
  selector: 'app-indexed-sequence',
  templateUrl: './indexed-sequence.component.html',
  styleUrls: ['./indexed-sequence.component.css']
})
export class IndexedSequenceComponent implements OnInit {
  @Input() indexedSequence: IndexedSequence;
  @Input() canUpdate: boolean;
  @Input() showSequenceCategory: boolean;
  @Output() sequenceDeleted = new EventEmitter<IndexedSequence>();

  configurationData: ConfigurationData;

  sequenceTypes: NamedValue[];
  sequenceCategories: NamedValue[];

  constructor(private configurationDataService: ConfigurationDataService) { }

  ngOnInit(): void {
    this.loadConfigurationData();
  }

  loadConfigurationData() {
    this.configurationDataService.getConfigurationData().subscribe(data => {
      this.configurationData = data;
      this.sequenceTypes = this.configurationData.sequenceTypes.map(x => ({ name: x }));
      this.sequenceCategories = this.configurationData.sequenceCategorizations.map(x => ({ name: x }));
    });
  }

  delete() {
    this.sequenceDeleted.emit(this.indexedSequence);
    console.log('emited');


  }



}
