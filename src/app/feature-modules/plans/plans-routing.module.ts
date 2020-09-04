import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { HistoryComponent } from 'src/app/shared/components/history/history.component';
import { ProductionPlanComponent } from './components/production-plan/production-plan.component';
import { PhenotypingPlanComponent } from './components/phenotyping-plan/phenotyping-plan.component';
import { PlanRouterComponent } from './components/plan-router/plan-router.component';
import { OutcomeDetailComponent } from './components/outcomes/outcome-detail/outcome-detail.component';

const routes: Routes = [
  { path: 'plan/:pid', component: PlanRouterComponent },
  { path: 'production-plan/:pid', component: ProductionPlanComponent },
  { path: 'phenotyping-plan/:pid', component: PhenotypingPlanComponent },
  { path: 'plan/:pid/outcomes/:tpo', component: OutcomeDetailComponent },
  {
    path: 'outcomes/:tpo', component: OutcomeDetailComponent
  },
  {
    path: 'outcomes/:tpo/history', component: HistoryComponent,
    data: {
      title: 'Outcome History',
      id: 'tpo',
      entity: 'outcome'
    }
  },
  { path: 'production-plan/:pid/history', component: HistoryComponent},
  { path: 'phenotyping-plan/:pid/history', component: HistoryComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlansRoutingModule { }
