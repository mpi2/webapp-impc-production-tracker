import { Component, OnInit, Input } from '@angular/core';
import { IndexedSequence } from '../../model/indexed-sequence';
import { ConfigurationData, ConfigurationDataService } from 'src/app/core';
import { NamedValue } from 'src/app/core/model/common/named-value';
import { IndexedLocation } from '../../model/indexed-location';
import { InputHandlerService } from 'src/app/core/services/input-handler.service';
import { DeleteConfirmationComponent } from 'src/app/shared/components/delete-confirmation/delete-confirmation.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-indexed-locations',
    templateUrl: './indexed-locations.component.html',
    styleUrls: ['./indexed-locations.component.css'],
    standalone: false
})
export class IndexedLocationsComponent implements OnInit {
  @Input() indexedSequence: IndexedSequence;
  @Input() canUpdate: IndexedSequence;

  nextNewId = -1;

  configurationData: ConfigurationData;

  species: NamedValue[];
  strains: NamedValue[];

  tmpIndexRowName = 'tmp_id';

  originalData: IndexedLocation[];

  displayedColumns: string[] = ['index', 'chr', 'start', 'stop', 'strand', 'genomeBuild', 'strain', 'species'];

  constructor(
    private configurationDataService: ConfigurationDataService,
    private inputHandlerService: InputHandlerService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.originalData = JSON.parse(JSON.stringify(this.indexedSequence.sequence.sequenceLocations));
    this.loadConfigurationData();
  }


  loadConfigurationData() {
    this.configurationDataService.getConfigurationData().subscribe(data => {
      this.configurationData = data;
      this.species = this.configurationData.species.map(x => ({ name: x }));
      this.strains = this.configurationData.trackedStrains.map(x => ({ name: x }));
    });
  }

  addRow() {
    const indexedLocation: IndexedLocation = new IndexedLocation();
    indexedLocation[this.tmpIndexRowName] = this.nextNewId--;
    this.indexedSequence.sequence.sequenceLocations.push(indexedLocation);
  }

  deleteRow(indexedLocation: IndexedLocation) {
    if (this.isNewRecord(indexedLocation)) {
      this.deleteLocation(indexedLocation);
    } else {
      this.showDeleteConfirmationDialog(indexedLocation);
    }
  }

  showDeleteConfirmationDialog(indexedLocation: IndexedLocation) {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '250px',
      data: { confirmed: false }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteLocation(indexedLocation);
      }
    });
  }

  deleteLocation(indexedLocation: IndexedLocation) {
    if (this.isNewRecord(indexedLocation)) {
      this.indexedSequence.sequence.sequenceLocations = this.indexedSequence.sequence.sequenceLocations
        .filter(x => x[this.tmpIndexRowName] !== indexedLocation[this.tmpIndexRowName]);
    } else {
      this.indexedSequence.sequence.sequenceLocations = this.indexedSequence.sequence.sequenceLocations
        .filter(x => x.id !== indexedLocation.id);
    }
  }

  onChange(indexedLocation: IndexedLocation) {
    indexedLocation = this.fixFormat(indexedLocation);
  }

  private isNewRecord(indexedLocation: IndexedLocation) {
    return indexedLocation.id === null;
  }

  private fixFormat(indexedLocation: IndexedLocation) {
    indexedLocation.locationIndex = this.inputHandlerService.getNumericValueOrNull(indexedLocation.locationIndex);
    return indexedLocation;
  }

}
