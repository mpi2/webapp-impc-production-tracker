import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Mutation} from 'src/app/feature-modules/plans/model/outcomes/mutation';
import {InsertedCoordinates} from "../../model/inserted-coordinates";
import {ConfigurationData, ConfigurationDataService} from "../../../../core";
import {NamedValue} from "../../../../core/model/common/named-value";

@Component({
    selector: 'app-deletion-coordinates',
    templateUrl: './deletion-coordinates.component.html',
    styleUrls: ['./deletion-coordinates.component.css'],
    standalone: false
})
export class DeletionCoordinatesComponent implements OnInit {
  @Input() mutation: Mutation;
  @Input() canUpdate: boolean;
  @Input() editCoordinatesChecked: boolean;
  @Output() coordinatesDeleted = new EventEmitter<InsertedCoordinates>();

  configurationData: ConfigurationData;
  sequenceTypes: NamedValue[];
  sequenceCategories: NamedValue[];

  tmpIndexRowName = 'tmp_id';
  nextNewId = -1;
  constructor(private configurationDataService: ConfigurationDataService) { }

  ngOnInit(): void {
  }

  loadConfigurationData() {
    this.configurationDataService.getConfigurationData().subscribe(data => {
      this.configurationData = data;
      this.sequenceTypes = this.configurationData.sequenceTypes.map(x => ({ name: x }));
      this.sequenceCategories = this.configurationData.sequenceCategorizations.map(x => ({ name: x }));
    });
  }

  deleteInsertedCoordinates(insertedCoordinates: InsertedCoordinates) {
    this.coordinatesDeleted.emit(insertedCoordinates);
  }

  addDeletionCoordinates() {
    const insertedCoordinates: InsertedCoordinates = new InsertedCoordinates();
    insertedCoordinates[this.tmpIndexRowName] = this.nextNewId--;
    this.mutation.molecularMutationDeletions.push(insertedCoordinates);
  }

}
