import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { GeneService } from '../_services';
import { GeneSummary } from '../_models';

@Component({
  selector: 'app-gene-search',
  templateUrl: './gene-search.component.html',
  styleUrls: ['./gene-search.component.css']
})
export class GeneSearchComponent implements OnInit {
  geneSearchForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';
  genes: GeneSummary[] = [];

  constructor(
    private formBuilder: FormBuilder,
    // private route: ActivatedRoute,
    // private router: Router,
    // private authenticationService: AuthenticationService
    private geneService: GeneService
  ) { }

  ngOnInit() {
    this.geneSearchForm = this.formBuilder.group({
      geneSymbol: ['']
    });

    this.geneService.getAll().pipe(first()).subscribe(genes => {
      this.genes = genes;
    });

  }

}
