import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IndexedSequence } from '../../model/indexed-sequence';
import { ConfigurationDataService, ConfigurationData } from 'src/app/core';
import { NamedValue } from 'src/app/core/model/common/named-value';
import { Mutation } from 'src/app/feature-modules/plans/model/outcomes/mutation';

@Component({
    selector: 'app-indexed-sequence',
    templateUrl: './indexed-sequence.component.html',
    styleUrls: ['./indexed-sequence.component.css'],
    standalone: false
})
export class IndexedSequenceComponent implements OnInit {
  @Input() mutation: Mutation;
  // @Input() indexedSequence: IndexedSequence;
  @Input() canUpdate: boolean;
  @Input() showSequenceCategory: boolean;
  @Input() showLocations: boolean;
  @Output() sequenceDeleted = new EventEmitter<IndexedSequence>();

  configurationData: ConfigurationData;
  sequenceTypes: NamedValue[];
  sequenceCategories: NamedValue[];

  tmpIndexRowName = 'tmp_id';
  nextNewId = -1;

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

  deleteSequence(indexedSequence: IndexedSequence) {
    this.sequenceDeleted.emit(indexedSequence);
  }

  createSequence() {
    const indexedSequence: IndexedSequence = new IndexedSequence();
    indexedSequence[this.tmpIndexRowName] = this.nextNewId--;
    this.mutation.mutationSequences.push(indexedSequence);
  }

}
