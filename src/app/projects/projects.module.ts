import { NgModule } from '@angular/core';

import { CreateProjectComponent } from './components/create-project/create-project.component';
import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { ProjectDetailComponent } from './components/project-detail/project-detail.component';
import { ProductionPlansComponent } from './components/production-plans/production-plans.component';
import { PhenotypePlansComponent } from './components/phenotype-plans/phenotype-plans.component';
import { ProductionPlanDetailComponent } from './components/production-plan-detail/production-plan-detail.component';
import { PhenotypePlanDetailComponent } from './components/phenotype-plan-detail/phenotype-plan-detail.component';

import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    CreateProjectComponent,
    ProjectListComponent,
    ProjectDetailComponent,
    ProductionPlansComponent,
    PhenotypePlansComponent,
    ProductionPlanDetailComponent,
    PhenotypePlanDetailComponent
  ],
  imports: [
    ProjectsRoutingModule,
    SharedModule
  ]
})
export class ProjectsModule { }
