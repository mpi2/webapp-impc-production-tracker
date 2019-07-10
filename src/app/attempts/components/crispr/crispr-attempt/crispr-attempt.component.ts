import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CrisprAttempt } from 'src/app/attempts/model/crispr/crispr-attempt';

@Component({
  selector: 'app-crispr-attempt',
  templateUrl: './crispr-attempt.component.html',
  styleUrls: ['./crispr-attempt.component.css']
})
export class CrisprAttemptComponent implements OnInit {

  dateModel;
  editCrisprAttempt: FormGroup;

  @Input() attemptType: string;
  @Input() crisprAttempt: CrisprAttempt;
  @Input() canUpdatePlan: boolean;

  @Output() modifiedAttemptEmmiter = new EventEmitter<any>();

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.editCrisprAttempt = this.formBuilder.group({
      dp: ['', Validators.required],
    });

    const date = new Date(this.crisprAttempt.miDate);
    this.dateModel = { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
    this.editCrisprAttempt.get('dp').setValue(this.dateModel);
  }

  onDateSelected() {
    const pickedDateModel = this.editCrisprAttempt.get('dp').value;
    const newDate = new Date(pickedDateModel.year,  pickedDateModel.month - 1 , pickedDateModel.day, 0);
  
    this.crisprAttempt.miDate = newDate;
    this.notifyCrisprAttemptChanged();
  }

  notifyCrisprAttemptChanged() {
    this.modifiedAttemptEmmiter.emit(this.crisprAttempt);
  }

  onAttemptChangedByChildren(e) {
    console.log('CrisprAttemptComponent changed...');
    this.notifyCrisprAttemptChanged();
  }

}
