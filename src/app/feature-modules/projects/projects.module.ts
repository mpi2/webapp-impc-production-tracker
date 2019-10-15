import { NgModule } from '@angular/core';

import { CreateProjectComponent } from './components/create-project/create-project.component';
import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { ProjectDetailComponent } from './components/project-detail/project-detail.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PlansModule } from '../plans/plans.module';
import { IntentionByGeneComponent } from './components/intention-by-gene/intention-by-gene.component';
import { GenesModule } from '../genes/genes.module';
import { IntentionsComponent } from './components/intentions/intentions.component';
import { IntentionByLocationComponent } from './components/intention-by-location/intention-by-location.component';
import { LocationsModule } from '../locations/locations.module';

@NgModule({
  declarations: [
    CreateProjectComponent,
    ProjectListComponent,
    ProjectDetailComponent,
    IntentionByGeneComponent,
    IntentionsComponent,
    IntentionByLocationComponent,
  ],
  imports: [
    ProjectsRoutingModule,
    PlansModule,
    GenesModule,
    LocationsModule,
    SharedModule
  ]
})
export class ProjectsModule { }
