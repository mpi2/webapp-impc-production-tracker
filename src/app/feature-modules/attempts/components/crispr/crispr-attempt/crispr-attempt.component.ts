import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CrisprAttempt } from '../../../model/crispr/crispr-attempt';

@Component({
  selector: 'app-crispr-attempt',
  templateUrl: './crispr-attempt.component.html',
  styleUrls: ['./crispr-attempt.component.css']
})
export class CrisprAttemptComponent implements OnInit {

  editCrisprAttempt: FormGroup;

  @Input() crisprAttempt: CrisprAttempt;
  @Input() canUpdatePlan: boolean;

  @Output() modifiedAttemptEmmiter = new EventEmitter<any>();

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.editCrisprAttempt = this.formBuilder.group({
    });
  }

  notifyCrisprAttemptChanged() {
    this.modifiedAttemptEmmiter.emit(this.crisprAttempt);
  }

  onAttemptChangedByChildren(e) {
    console.log('CrisprAttemptComponent changed...');
    this.notifyCrisprAttemptChanged();
  }

}
