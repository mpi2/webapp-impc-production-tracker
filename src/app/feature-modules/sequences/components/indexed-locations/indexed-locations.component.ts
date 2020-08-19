import { Component, OnInit, Input } from '@angular/core';
import { IndexedSequence } from '../../model/indexed-sequence';
import { ConfigurationData, ConfigurationDataService } from 'src/app/core';
import { NamedValue } from 'src/app/core/model/common/named-value';
import { IndexedLocation } from '../../model/indexed-location';

@Component({
  selector: 'app-indexed-locations',
  templateUrl: './indexed-locations.component.html',
  styleUrls: ['./indexed-locations.component.css']
})
export class IndexedLocationsComponent implements OnInit {
  @Input() indexedSequence: IndexedSequence;
  @Input() canUpdate: IndexedSequence;

  nextNewId = 0;

  configurationData: ConfigurationData;

  editionStatusByLocation = new Map<number, string>();

  species: NamedValue[];
  strains: NamedValue[];

  displayedColumns: string[] = ['index', 'chr', 'start', 'stop', 'strand', 'genomeBuild', 'strain', 'species'];

  constructor(private configurationDataService: ConfigurationDataService) { }

  ngOnInit(): void {
    this.loadConfigurationData();
  }

  setEmptyEditionStatuses(): void {
    this.indexedSequence.sequence.sequenceLocations.map(x => this.editionStatusByLocation.set(x.id, ''));
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
    indexedLocation.id = this.nextNewId--;
    console.log(indexedLocation);

    this.indexedSequence.sequence.sequenceLocations.push(indexedLocation);
    this.editionStatusByLocation.set(indexedLocation.id, 'Created in memory');
    // this.indexedSequence.sequence.sequenceLocations(indexedLocation);
    // this.editionStatusByDistributionProduct.set(distributionProduct.id, 'Created in memory');
    // this.dataSource = [...this.colony.distributionProducts];
  }

  getEditionStatusByLocation(id: number): string {
    return this.editionStatusByLocation.get(id);
  }

}
