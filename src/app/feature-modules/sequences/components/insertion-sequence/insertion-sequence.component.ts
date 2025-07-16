import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ConfigurationDataService, ConfigurationData } from 'src/app/core';
import { NamedValue } from 'src/app/core/model/common/named-value';
import { Mutation } from 'src/app/feature-modules/plans/model/outcomes/mutation';
import {InsertedSequence} from "../../model/inserted-sequence";

@Component({
    selector: 'app-insertion-sequence',
    templateUrl: './insertion-sequence.component.html',
    styleUrls: ['./insertion-sequence.component.css'],
    standalone: false
})
export class InsertionSequenceComponent implements OnInit {
  @Input() mutation: Mutation;
  @Input() canUpdate: boolean;
  @Input() showSequenceCategory: boolean;
  @Input() showLocations: boolean;
  @Output() sequenceDeleted = new EventEmitter<InsertedSequence>();

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

  deleteSequence(insertedSequence: InsertedSequence) {
    this.sequenceDeleted.emit(insertedSequence);
  }

  createSequence() {
    const insertedSequence: InsertedSequence = new InsertedSequence();
    insertedSequence[this.tmpIndexRowName] = this.nextNewId--;
    this.mutation.insertionSequences.push(insertedSequence);
  }

}
