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
  selectedTransition: Transition;
  userTransitions: Transition[];

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
    console.log('current userTransitions:', this.userTransitions);
    console.log('statusTransition.transitions:', this.statusTransition.transitions);
    this.selectedTransition = transition;
    if (transition) {
      this.statusTransition.actionToExecute = transition.action;
    } else {
      this.statusTransition.actionToExecute = null;
    }
  }

}
