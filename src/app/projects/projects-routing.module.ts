import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { ProjectDetailComponent } from './components/project-detail/project-detail.component';
import { CreateProjectComponent } from './components/create-project/create-project.component';

import { AuthGuard } from '../core/guards/auth.guard';
import { ProductionPlanComponent, PhenotypingPlanComponent } from '../plans';
import { HistoryComponent } from '../shared/components/history/history.component';

const routes: Routes = [
  { path: 'projects/:id', component: ProjectDetailComponent, canActivate: [AuthGuard],
    // children: [
    //   { path: 'production-plan/:pid', component: ProductionPlanComponent },
    //   { path: 'phenotyping-plan/:pid', component: PhenotypingPlanComponent},
    // ]
  },
  { path: 'projects/:id/production-plan/:pid', component: ProductionPlanComponent },
  { path: 'projects/:id/phenotyping-plan/:pid', component: PhenotypingPlanComponent},
  { path: 'projects/:id/production-plan/:pid/history', component: HistoryComponent},
  { path: 'projects/:id/phenotyping-plan/:pid/history', component: HistoryComponent },

  { path: 'projects', component: ProjectListComponent, canActivate: [AuthGuard] },
  { path: 'create-project', component: CreateProjectComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule { }
