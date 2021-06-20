import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { StatusTransition } from 'src/app/model/status_transition/status_transition';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Transition } from 'src/app/model/status_transition/transition';

@Component({
  selector: 'app-status-transition',
  templateUrl: './status-transition.component.html',
  styleUrls: ['./status-transition.component.css']
})
export class StatusTransitionComponent implements OnInit , OnChanges {

  @Input() statusTransition: StatusTransition;
  @Input() canUpdate: boolean;
  statusTransitionForm: FormGroup;
  nextStatus: string;
  userTransitions: Transition[];
  transitionNote: string;

  constructor(private formBuilder: FormBuilder ) { }

  ngOnInit(): void {
    this.userTransitions = [...this.statusTransition.transitions.filter(x => x.triggeredByUser)];
    this.statusTransitionForm = this.formBuilder.group({
      currentStatus: [''],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.userTransitions = [...this.statusTransition.transitions.filter(x => x.triggeredByUser)];
  }

  onTransitionSelected(transition: Transition) {
    if (transition) {
      this.transitionNote = transition.note;
    } else {
      this.transitionNote = null;
    }
  }

}
