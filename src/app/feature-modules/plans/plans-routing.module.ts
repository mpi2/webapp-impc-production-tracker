import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductionPlanComponent, PhenotypingPlanComponent } from '.';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { HistoryComponent } from 'src/app/shared/components/history/history.component';

const routes: Routes = [
  { path: 'production-plan/:pid', component: ProductionPlanComponent, canActivate: [AuthGuard] },
  { path: 'phenotyping-plan/:pid', component: PhenotypingPlanComponent, canActivate: [AuthGuard] },
  { path: 'production-plan/:pid/history', component: HistoryComponent},
  { path: 'phenotyping-plan/:pid/history', component: HistoryComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlansRoutingModule { }
