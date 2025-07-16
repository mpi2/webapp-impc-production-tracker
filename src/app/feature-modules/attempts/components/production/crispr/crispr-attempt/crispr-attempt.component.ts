import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CrisprAttempt } from '../../../../model/production/crispr/crispr-attempt';

@Component({
    selector: 'app-crispr-attempt',
    templateUrl: './crispr-attempt.component.html',
    styleUrls: ['./crispr-attempt.component.css'],
    standalone: false
})
export class CrisprAttemptComponent implements OnInit {

  @Input() crisprAttempt: CrisprAttempt;
  @Input() canUpdatePlan: boolean;

  editCrisprAttempt: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    if (!this.crisprAttempt) {
      this.crisprAttempt = new CrisprAttempt();
    }
    this.editCrisprAttempt = this.formBuilder.group({
    });
  }

}
