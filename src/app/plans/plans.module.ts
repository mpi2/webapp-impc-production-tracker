import { NgModule } from '@angular/core';

import { PlansRoutingModule } from './plans-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ProductionPlanComponent } from './components/production-plan/production-plan.component';
import { PhenotypingPlanComponent } from './components/phenotyping-plan/phenotyping-plan.component';
import { PlanHistoryComponent } from './components/plan-history/plan-history.component';
import { PlanSummaryComponent } from './components/plan-summary/plan-summary.component';

@NgModule({
  declarations: [
    ProductionPlanComponent,
    PhenotypingPlanComponent,
    PlanHistoryComponent,
    PlanSummaryComponent],
  imports: [
    SharedModule,
    PlansRoutingModule
  ],
  exports: [
    PlanSummaryComponent
  ]
})
export class PlansModule { }
