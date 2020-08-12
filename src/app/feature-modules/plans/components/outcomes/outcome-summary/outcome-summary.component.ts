import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Outcome } from '../../../model/outcomes/outcome';
import { MutationService } from '../../../services/mutation.service';

@Component({
  selector: 'app-outcome-summary',
  templateUrl: './outcome-summary.component.html',
  styleUrls: ['./outcome-summary.component.css']
})
export class OutcomeSummaryComponent implements OnInit {
  @Input() outcome: Outcome;
  @Input() canUpdate: boolean;

  outcomeForm: FormGroup;

  mutationSummaryColumns: string[] = ['symbol', 'molecularMutationType'];

  constructor(private formBuilder: FormBuilder, private mutationService: MutationService) { }

  ngOnInit(): void {
    this.outcomeForm = this.formBuilder.group({
      outcomeTypeName: [''],
    });
  }

  formatAlleleSymbol(symbol: string) {
    return this.mutationService.formatAlleleSymbol(symbol);
  }

}
