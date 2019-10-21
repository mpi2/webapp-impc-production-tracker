import { NgModule } from '@angular/core';

import { PlansRoutingModule } from './plans-routing.module';
import { ProductionPlanComponent } from './components/production-plan/production-plan.component';
import { PhenotypingPlanComponent } from './components/phenotyping-plan/phenotyping-plan.component';
import { PlanHistoryComponent } from './components/plan-history/plan-history.component';
import { PlanSummaryComponent } from './components/plan-summary/plan-summary.component';
import { PlanDetailsComponent } from './components/plan-details/plan-details.component';
import { AttemptsModule } from '../attempts/attempts.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { UpdateNotificationComponent } from './components/update-notification/update-notification.component';
import { IntentionsModule } from '../intentions/intentions.module';

@NgModule({
  declarations: [
    ProductionPlanComponent,
    PhenotypingPlanComponent,
    PlanHistoryComponent,
    PlanSummaryComponent,
    PlanDetailsComponent,
    UpdateNotificationComponent],
  imports: [
    SharedModule,
    PlansRoutingModule,
    AttemptsModule,
    IntentionsModule

  ],
  exports: [
    PlanSummaryComponent,
    UpdateNotificationComponent
  ]
})
export class PlansModule { }
