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
import { PlanRouterComponent } from './components/plan-router/plan-router.component';
import { OutcomeSummaryComponent } from './components/outcomes/outcome-summary/outcome-summary.component';
import { OutcomeListComponent } from './components/outcomes/outcome-list/outcome-list.component';
import { ColonyDetailComponent } from './components/outcomes/colony-detail/colony-detail.component';
import { DistributionProductListComponent } from './components/outcomes/distribution-product-list/distribution-product-list.component';
import { OutcomeDetailComponent } from './components/outcomes/outcome-detail/outcome-detail.component';
import { ColonySummaryComponent } from './components/outcomes/colony-summary/colony-summary.component';
import { MutationDetailComponent } from './components/outcomes/mutation-detail/mutation-detail.component';
import { SequencesModule } from '../sequences/sequences.module';
import { QcResultsComponent } from './components/outcomes/qc-results/qc-results.component';
import { PlanCreationComponent } from './components/plan-creation/plan-creation.component';

@NgModule({
  declarations: [
    ProductionPlanComponent,
    PhenotypingPlanComponent,
    PlanHistoryComponent,
    PlanSummaryComponent,
    PlanDetailsComponent,
    UpdateNotificationComponent,
    PlanRouterComponent,
    OutcomeSummaryComponent,
    OutcomeListComponent,
    ColonyDetailComponent,
    DistributionProductListComponent,
    OutcomeDetailComponent,
    ColonySummaryComponent,
    MutationDetailComponent,
    QcResultsComponent,
    PlanCreationComponent
  ],
  imports: [
    SharedModule,
    PlansRoutingModule,
    AttemptsModule,
    IntentionsModule,
    SequencesModule

  ],
  exports: [
    PlanSummaryComponent,
    UpdateNotificationComponent
  ]
})
export class PlansModule { }
