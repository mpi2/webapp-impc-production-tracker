import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CrisprAttempt } from 'src/app/feature-modules/attempts/model/production/crispr/crispr-attempt';

@Component({
    selector: 'app-crispr-attempt-details',
    templateUrl: './crispr-attempt-details.component.html',
    styleUrls: ['./crispr-attempt-details.component.css'],
    standalone: false
})
export class CrisprAttemptDetailsComponent implements OnInit {

  @Input() crisprAttempt: CrisprAttempt;
  @Input() canUpdatePlan: boolean;

  editCrisprAttemptDetails: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.editCrisprAttemptDetails = this.formBuilder.group({
      miExternalRef: [this.crisprAttempt.attemptExternalRef, Validators.required],
      comment: [this.crisprAttempt.comment],
      experimental: []
    });
  }

  onDateChanged() {
    const selectedDate = this.crisprAttempt.miDate;
    this.crisprAttempt.miDate = new Date(Date.UTC(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate()));
  }

  onTextmiExternalRefChanged(): void {
    const newmiExternalRef = this.editCrisprAttemptDetails.get('miExternalRef').value;
    this.crisprAttempt.attemptExternalRef = newmiExternalRef;
  }

  onTextCommentChanged(): void {
    const newComment = this.editCrisprAttemptDetails.get('comment').value;
    this.crisprAttempt.comment = newComment;
  }

  onExperimentalChecked(): void {
    this.crisprAttempt.experimental = !this.crisprAttempt.experimental;
  }

}
