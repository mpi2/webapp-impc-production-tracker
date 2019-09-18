import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CrisprAttempt } from '../../../../model/production/crispr/crispr-attempt';

@Component({
  selector: 'app-crispr-attempt',
  templateUrl: './crispr-attempt.component.html',
  styleUrls: ['./crispr-attempt.component.css']
})
export class CrisprAttemptComponent implements OnInit {

  editCrisprAttempt: FormGroup;

  @Input() crisprAttempt: CrisprAttempt;
  @Input() canUpdatePlan: boolean;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.editCrisprAttempt = this.formBuilder.group({
    });
  }

}
