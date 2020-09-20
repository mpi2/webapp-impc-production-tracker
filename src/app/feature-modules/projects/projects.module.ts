import { NgModule } from '@angular/core';
import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { ProjectDetailComponent } from './components/project-detail/project-detail.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PlansModule } from '../plans/plans.module';
import { GenesModule } from '../genes/genes.module';
import { SequencesModule } from '../sequences/sequences.module';
import { IntentionsModule } from '../intentions/intentions.module';
import { ProjectListContentComponent } from './components/project-list-content/project-list-content.component';
import { FiltersModule } from '../filters/filters.module';
import { ProjectCreationComponent } from './components/project-creation/project-creation.component';
import { ProjectIntentionComponent } from './components/project-intention/project-intention.component';
import { ProjectConsortiumInstitutesComponent } from './components/project-consortium-institutes/project-consortium-institutes.component';

@NgModule({
  declarations: [
    ProjectCreationComponent,
    ProjectListComponent,
    ProjectDetailComponent,
    ProjectListContentComponent,
    ProjectCreationComponent,
    ProjectIntentionComponent,
    ProjectConsortiumInstitutesComponent
  ],
  imports: [
    ProjectsRoutingModule,
    PlansModule,
    GenesModule,
    SequencesModule,
    IntentionsModule,
    FiltersModule,
    SharedModule
  ]
})
export class ProjectsModule { }
