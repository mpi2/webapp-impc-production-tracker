import { Component, OnInit, Input } from '@angular/core';
import { ProductionPlan } from 'src/app/_models/project/production_plan/productionPlan';
import { ProjectService } from 'src/app/_services';
import { first } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationComponent } from 'src/app/shared/confirmation/confirmation.component';

@Component({
  selector: 'app-production-plan-detail',
  templateUrl: './production-plan-detail.component.html',
  styleUrls: ['./production-plan-detail.component.css']
})
export class ProductionPlanDetailComponent implements OnInit {
  @Input() productionPlan: ProductionPlan;
  public isCollapsed = true;

  constructor(private projectService: ProjectService, private _modalService: NgbModal) { }

  ngOnInit() {
    console.log('<<productionPlan in class ProductionPlanDetailComponent>>:: ', this.productionPlan);
  }

  open(element) {
    const modalRef = this._modalService.open(ConfirmationComponent);
    modalRef.componentInstance.functionOnOk = this.onDeleteMutagenesisDonor;
    modalRef.componentInstance.element = element;
  }

  onDeleteMutagenesisDonor = (mutagenesisDonor)  => {
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
