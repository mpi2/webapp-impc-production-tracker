import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Colony } from '../../../model/outcomes/colony';

@Component({
  selector: 'app-colony-summary',
  templateUrl: './colony-summary.component.html',
  styleUrls: ['./colony-summary.component.css']
})
export class ColonySummaryComponent implements OnInit {

  @Input() colony: Colony;

  colonyForm: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.colonyForm = this.formBuilder.group({
    });
  }

}
