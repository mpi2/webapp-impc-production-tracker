import { Component, OnInit, Input } from '@angular/core';
import { ProductionPlan } from 'src/app/projects/model/production_plan/productionPlan';
import { ProjectService } from 'src/app/_services';
import { first } from 'rxjs/operators';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { ConfirmationComponent } from 'src/app/shared/confirmation/confirmation.component';

@Component({
  selector: 'app-production-plan-detail',
  templateUrl: './production-plan-detail.component.html',
  styleUrls: ['./production-plan-detail.component.css']
})
export class ProductionPlanDetailComponent implements OnInit {
  @Input() productionPlan: ProductionPlan;
  isCollapsed = true;
  collapseButtonText = 'See more...';

  registerForm: FormGroup;
  closeResult: string;

  constructor(private projectService: ProjectService, private _modalService: NgbModal, private formBuilder: FormBuilder) { }

  ngOnInit() {
    console.log('<<productionPlan in class ProductionPlanDetailComponent>>:: ', this.productionPlan);
    this.registerForm = this.formBuilder.group({
      firstName: [''],
      lastName: ['']
    }, {
      });
  }

  onCollapsed() {
    this.isCollapsed = !this.isCollapsed;
    if (this.isCollapsed) {
      this.collapseButtonText = 'See more...';
    } else {
      this.collapseButtonText = 'See less...';
    }
  }

  openModalToDeleteMutagenesisDonor(element) {
    const modalRef = this._modalService.open(ConfirmationComponent);
    modalRef.componentInstance.functionOnOk = this.onDeleteMutagenesisDonor;
    modalRef.componentInstance.element = element;
  }

  openModalToCreateMutagenesisDonor() {
    const modalRef = this._modalService.open(ConfirmationComponent);
  }

  open(content) {
    this._modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      console.log('reason');

    });
  }

  saveMuta() {
    console.log('Save muta');
    this._modalService.dismissAll();

  }

  onDeleteMutagenesisDonor = (mutagenesisDonor) => {
    console.log('::mutagenesisDonor', mutagenesisDonor);
    let current = this.productionPlan.attempt.crisprAttempt.mutagenesisDonors;
    const index = current.indexOf(mutagenesisDonor, 0);
    if (index > -1) {
      current.splice(index, 1);
      // TODO: Do we need to subscribe? Or just calling the service is enough?
      this.projectService.deleteMutagenesisDonor(mutagenesisDonor._links.delete.href).pipe(first()).subscribe(data => {
      })
    }
  }
}
