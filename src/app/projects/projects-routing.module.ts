import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { ProjectDetailComponent } from './components/project-detail/project-detail.component';
import { CreateProjectComponent } from './components/create-project/create-project.component';

import { AuthGuard } from '../core/guards/auth.guard';

const routes: Routes = [
  { path: 'projects/:id', component: ProjectDetailComponent, canActivate: [AuthGuard] },
  { path: 'projects', component: ProjectListComponent, canActivate: [AuthGuard] },
  { path: 'create-project', component: CreateProjectComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule { }
