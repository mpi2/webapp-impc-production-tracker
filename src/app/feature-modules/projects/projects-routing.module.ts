import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { ProjectDetailComponent } from './components/project-detail/project-detail.component';
import { CreateProjectComponent } from './components/create-project/create-project.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { HistoryComponent } from 'src/app/shared/components/history/history.component';
import { ProductionPlanComponent } from '../plans/components/production-plan/production-plan.component';
import { PhenotypingPlanComponent } from '../plans/components/phenotyping-plan/phenotyping-plan.component';
import { PlanRouterComponent } from '../plans/components/plan-router/plan-router.component';
import { OutcomeDetailComponent } from '../plans/components/outcomes/outcome-detail/outcome-detail.component';
// tslint:disable-next-line:max-line-length
import { PhenotypingStageDetailsComponent } from '../attempts/components/phenotyping/phenotyping-stage-details/phenotyping-stage-details.component';

const routes: Routes = [
  {
    path: 'projects/:id', component: ProjectDetailComponent,
  },
  {
    path: 'projects/:id/production-plan/:pid', component: ProductionPlanComponent
  },
  {
    path: 'projects/:id/phenotyping-plan/:pid', component: PhenotypingPlanComponent
  },
  {
    path: 'projects/:id/plan/:pid', component: PlanRouterComponent
  },

  {
    path: 'projects/:id/plans/:pid/outcomes/:tpo', component: OutcomeDetailComponent
  },
  {
    path: 'projects/:id/plans/:pid/outcome-creation', component: OutcomeDetailComponent
  },
  {
    path: 'projects/:id/phenotyping-plan/:pid/phenotyping-stage/:psn', component: PhenotypingStageDetailsComponent
  },
  {
    path: 'projects/:id/plans/:pid/outcomes/:tpo/history', component: HistoryComponent,
    data: {
      title: 'Outcome History',
      id: 'tpo',
      entity: 'outcome'
    }
  },

  {
    path: 'projects/:id/history', component: HistoryComponent,
    data: {
      title: 'Project History',
      id: 'id',
      entity: 'project'
    }
  },

  {
    path: 'projects/:id/production-plan/:pid/history', component: HistoryComponent,
    data: {
      title: 'Project History',
      id: 'pid',
      entity: 'plan'
    }
  },
  {
    path: 'projects/:id/phenotyping-plan/:pid/history', component: HistoryComponent,
    data: {
      title: 'Project History',
      id: 'pid',
      entity: 'plan'
    }
  },

  { path: 'projects', component: ProjectListComponent },
  { path: 'create-project', component: CreateProjectComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule { }
