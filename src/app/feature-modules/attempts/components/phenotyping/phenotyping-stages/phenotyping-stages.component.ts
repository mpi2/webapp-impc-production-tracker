import { Component, OnInit, Input } from '@angular/core';
import { PhenotypingAttempt } from '../../../model/phenotyping/phenotyping_attempt';
import { PhenotypingStageService } from 'src/app/feature-modules/plans/services/phenotyping-stage.service';
import { PhenotypingStage } from '../../../model/phenotyping/phenotyping-stage';

@Component({
  selector: 'app-phenotyping-stages',
  templateUrl: './phenotyping-stages.component.html',
  styleUrls: ['./phenotyping-stages.component.css']
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
    /* tslint:disable:no-string-literal */
    if (this.phenotypingAttempt._links) {
      const links = this.phenotypingAttempt._links.phenotypingStages.map(x => x['href']);
      /* tslint:enable:no-string-literal */
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
