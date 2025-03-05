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
  systemTransitions: Transition[];
  transitionNote: string;
  systemTransitionNote: string;

  constructor(private formBuilder: FormBuilder ) { }

  ngOnInit(): void {
    this.userTransitions = [...this.statusTransition.transitions.filter(x => x.triggeredByUser)];
    this.statusTransitionForm = this.formBuilder.group({
      currentStatus: [''],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.userTransitions = [...this.statusTransition.transitions.filter(x => x.triggeredByUser)];
    this.systemTransitions = [...this.statusTransition.transitions.filter(x => !x.triggeredByUser)];
    this.getSystemTransitionNote(this.systemTransitions, this.userTransitions);
  }

  onTransitionSelected(transition: Transition) {
    if (transition) {
      this.transitionNote = transition.note;
    } else {
      this.transitionNote = null;
    }
  }


  getSystemTransitionNote(systemTransitions: Transition[], userTransitions: Transition[]) {
    if (systemTransitions.length > 0
      && (systemTransitions[0].action === 'updateToCreExcisionStarted'
      || systemTransitions[0].action === 'updateToCreExcisionComplete'
        || systemTransitions[0].action === 'updateToMouseAlleleModificationGenotypeConfirmed')) {
      this.systemTransitionNote = systemTransitions[0].note;
    } else {
      this.systemTransitionNote = null;
    }
    this.transitionNote = null;
  }

}
