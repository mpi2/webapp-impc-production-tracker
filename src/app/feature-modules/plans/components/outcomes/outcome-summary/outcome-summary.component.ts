import { Component, OnInit, Input } from '@angular/core';

import { Outcome } from '../../../model/outcomes/outcome';
import { MutationService } from '../../../services/mutation.service';

@Component({
    selector: 'app-outcome-summary',
    templateUrl: './outcome-summary.component.html',
    styleUrls: ['./outcome-summary.component.css'],
    standalone: false
})
export class OutcomeSummaryComponent implements OnInit {
  @Input() outcome: Outcome;
  @Input() canUpdate: boolean;

  mutationSummaryColumns: string[] = ['symbol', 'molecularMutationType'];

  constructor(private mutationService: MutationService) { }

  ngOnInit(): void {
  }

  formatAlleleSymbol(symbol: string) {
    return this.mutationService.formatAlleleSymbol(symbol);
  }

}
