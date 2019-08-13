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

  @Output() modifiedAttemptEmmiter = new EventEmitter<any>();

  editCrisprAttemptDetails: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.editCrisprAttemptDetails = this.formBuilder.group({
      miExternalRef: [this.crisprAttempt.attempt_external_ref, Validators.required],
      comments: [this.crisprAttempt.comments],
      experimental: []
    });
  }

  onDateChanged() {
    this.notifyChangeToParent();
  }

  onTextmiExternalRefChanged() {
    const newmiExternalRef = this.editCrisprAttemptDetails.get('miExternalRef').value;
    this.crisprAttempt.attempt_external_ref = newmiExternalRef;
    this.notifyChangeToParent();
  }

  onTextCommentChanged() 
  {
    const newComment = this.editCrisprAttemptDetails.get('comments').value;
    this.crisprAttempt.comments = newComment;
    this.notifyChangeToParent();
  }

  onExperimentalChecked() {
    this.crisprAttempt.experimental = !this.crisprAttempt.experimental;
    this.notifyChangeToParent();
  }

  notifyChangeToParent() {
    this.modifiedAttemptEmmiter.emit(this.crisprAttempt);
  }

}
