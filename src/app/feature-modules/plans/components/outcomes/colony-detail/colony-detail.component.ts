import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Colony } from '../../../model/outcomes/colony';

@Component({
  selector: 'app-colony-detail',
  templateUrl: './colony-detail.component.html',
  styleUrls: ['./colony-detail.component.css']
})
export class ColonyDetailComponent implements OnInit {
  @Input() colony: Colony;
  @Input() canUpdate: boolean;

  colonyForm: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    console.log('colony=>', this.colony);

    this.colonyForm = this.formBuilder.group({
      name: [''],
    });
  }

}
