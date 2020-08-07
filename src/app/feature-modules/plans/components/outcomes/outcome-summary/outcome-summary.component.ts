import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Outcome } from '../../../model/outcomes/outcome';

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

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.outcomeForm = this.formBuilder.group({
      outcomeTypeName: [''],
    });
  }

  formatAlleleSymbol(symbol: string) {
    let result = '';
    if (symbol) {
      const splited = symbol.split('');
      splited.forEach(x => {
        if (x === '<') {
          result += '<sup>';
        } else if (x === '>') {
          result += '</sup>';
        } else {
          result += x;
        }
      });
    }

    return result;
  }

}
