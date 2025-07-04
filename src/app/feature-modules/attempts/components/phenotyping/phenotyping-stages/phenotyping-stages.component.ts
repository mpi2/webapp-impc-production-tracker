import { Component, OnInit, Input } from '@angular/core';
import { PhenotypingAttempt } from '../../../model/phenotyping/phenotyping_attempt';
import { PhenotypingStageService } from 'src/app/feature-modules/plans/services/phenotyping-stage.service';
import { PhenotypingStage } from '../../../model/phenotyping/phenotyping-stage';

@Component({
    selector: 'app-phenotyping-stages',
    templateUrl: './phenotyping-stages.component.html',
    styleUrls: ['./phenotyping-stages.component.css'],
    standalone: false
})
export class PhenotypingStagesComponent implements OnInit {

  @Input() phenotypingAttempt: PhenotypingAttempt;
  @Input() canUpdate: boolean;

  originalPhenotypingAttemptAsString: string;

  error;

  phenotypingStages: PhenotypingStage[] = [];

  constructor(private phenotypingStageService: PhenotypingStageService) { }

  ngOnInit(): void {
    this.fetchPhenotypingStages();
    this.originalPhenotypingAttemptAsString = JSON.stringify(this.phenotypingAttempt);

  }

  fetchPhenotypingStages() {
    // eslint-disable-next-line no-underscore-dangle
    if (this.phenotypingAttempt._links) {
      // eslint-disable-next-line no-underscore-dangle
      const links = this.phenotypingAttempt._links.phenotypingStages.map(x => x['href']);
      if (links) {
        links.forEach(x => this.phenotypingStageService.getPhenotypingStageByUrl(x).subscribe(data => {
          this.phenotypingStages.push(data);
        }, error => {
          this.error = error;
        }));
      }
    }

  }

  phenotypingAttemptExists() {
    return this.originalPhenotypingAttemptAsString !== '{}';
  }

}
