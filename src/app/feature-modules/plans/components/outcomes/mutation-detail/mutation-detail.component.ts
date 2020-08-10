import { Component, OnInit, Input } from '@angular/core';
import { Mutation } from '../../../model/outcomes/mutation';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-mutation-detail',
  templateUrl: './mutation-detail.component.html',
  styleUrls: ['./mutation-detail.component.css']
})
export class MutationDetailComponent implements OnInit {
  @Input() mutation: Mutation;
  @Input() canUpdate: boolean;

  mutationForm: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    console.log('mutation', this.mutation);

    this.mutationForm = this.formBuilder.group({
    });
  }

}
