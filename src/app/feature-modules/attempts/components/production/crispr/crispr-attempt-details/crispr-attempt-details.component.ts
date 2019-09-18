import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CrisprAttempt } from '../../../..';

@Component({
  selector: 'app-crispr-attempt-details',
  templateUrl: './crispr-attempt-details.component.html',
  styleUrls: ['./crispr-attempt-details.component.css']
})
export class CrisprAttemptDetailsComponent implements OnInit {

  @Input() crisprAttempt: CrisprAttempt;
  @Input() canUpdatePlan: boolean;

  editCrisprAttemptDetails: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.editCrisprAttemptDetails = this.formBuilder.group({
      miExternalRef: [this.crisprAttempt.attempt_external_ref, Validators.required],
      comment: [this.crisprAttempt.comment],
      experimental: []
    });
  }

  onDateChanged() {
    let selectedDate = this.crisprAttempt.mi_date;
    this.crisprAttempt.mi_date = new Date(Date.UTC(selectedDate.getFullYear(),selectedDate.getMonth(), selectedDate.getDate()));
  }

  onTextmiExternalRefChanged() {
    const newmiExternalRef = this.editCrisprAttemptDetails.get('miExternalRef').value;
    this.crisprAttempt.attempt_external_ref = newmiExternalRef;
  }

  onTextCommentChanged() 
  {
    const newComment = this.editCrisprAttemptDetails.get('comment').value;
    this.crisprAttempt.comment = newComment;
  }

  onExperimentalChecked() {
    this.crisprAttempt.experimental = !this.crisprAttempt.experimental;
  }

}
