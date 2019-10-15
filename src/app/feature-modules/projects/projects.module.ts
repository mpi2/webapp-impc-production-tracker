import { NgModule } from '@angular/core';
import { CreateProjectComponent } from './components/create-project/create-project.component';
import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { ProjectDetailComponent } from './components/project-detail/project-detail.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PlansModule } from '../plans/plans.module';
import { GenesModule } from '../genes/genes.module';
import { LocationsModule } from '../locations/locations.module';
import { IntentionsModule } from '../intentions/intentions.module';

@NgModule({
  declarations: [
    CreateProjectComponent,
    ProjectListComponent,
    ProjectDetailComponent
  ],
  imports: [
    ProjectsRoutingModule,
    PlansModule,
    GenesModule,
    LocationsModule,
    IntentionsModule,
    SharedModule
  ]
})
export class ProjectsModule { }
