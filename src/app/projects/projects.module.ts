import { NgModule } from '@angular/core';

import { CreateProjectComponent } from './components/create-project/create-project.component';
import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { ProjectDetailComponent } from './components/project-detail/project-detail.component';
import { SharedModule } from '../shared/shared.module';
import { PlansModule } from '../plans/plans.module';
@NgModule({
  declarations: [
    CreateProjectComponent,
    ProjectListComponent,
    ProjectDetailComponent
  ],
  imports: [
    ProjectsRoutingModule,
    PlansModule,
    SharedModule
  ]
})
export class ProjectsModule { }
