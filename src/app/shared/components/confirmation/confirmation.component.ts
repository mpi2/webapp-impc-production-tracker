import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {
  @Input() functionOnOk;
  @Input() element;
  constructor(private modal: NgbActiveModal) { }

  ngOnInit() {
  }

  onOk() {
    this.functionOnOk(this.element);
    this.modal.close();
  }

}
