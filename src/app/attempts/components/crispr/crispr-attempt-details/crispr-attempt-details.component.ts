import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { CrisprAttempt } from 'src/app/attempts/model/crispr/crispr-attempt';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-crispr-attempt-details',
  templateUrl: './crispr-attempt-details.component.html',
  styleUrls: ['./crispr-attempt-details.component.css']
})
export class CrisprAttemptDetailsComponent implements OnInit {

  @Input() crisprAttempt: CrisprAttempt;
  @Input() canUpdatePlan: boolean;

  @Output() modifiedAttemptEmmiter = new EventEmitter<any>();

  dateModel: any = {};
  editCrisprAttemptDetails: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.editCrisprAttemptDetails = this.formBuilder.group({
      dp: ['', Validators.required],
      miExternalRef: [this.crisprAttempt.miExternalRef, Validators.required],
      comments: [this.crisprAttempt.comment]
    });

    const date = new Date(this.crisprAttempt.miDate);
    this.dateModel = { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
    this.editCrisprAttemptDetails.get('dp').setValue(this.dateModel);
  }

  onDateChanged() {
    const pickedDateModel = this.editCrisprAttemptDetails.get('dp').value;
    const newDate = new Date(pickedDateModel.year,  pickedDateModel.month - 1 , pickedDateModel.day, 0);
  
    this.crisprAttempt.miDate = newDate;
    this.notifyChangeToParent();
  }

  onTextmiExternalRefChanged() {
    const newmiExternalRef = this.editCrisprAttemptDetails.get('miExternalRef').value;
    this.crisprAttempt.miExternalRef = newmiExternalRef;
    this.notifyChangeToParent();
  }

  onTextCommentChanged() 
  {
    const newComment = this.editCrisprAttemptDetails.get('comments').value;
    this.crisprAttempt.comment = newComment;
    this.notifyChangeToParent();
  }

  onChange() {
    console.log('CHANGED TO',this.editCrisprAttemptDetails.get('dp').value);
    
  }

  notifyChangeToParent() {
    this.modifiedAttemptEmmiter.emit(this.crisprAttempt);
  }

}
