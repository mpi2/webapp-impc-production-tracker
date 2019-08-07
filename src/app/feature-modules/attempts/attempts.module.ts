import { NgModule } from '@angular/core';

import { AttemptsRoutingModule } from './attempts-routing.module';
import { CrisprAttemptDetailsComponent } from './components/crispr/crispr-attempt-details/crispr-attempt-details.component';
import { CrisprAttemptComponent } from './components/crispr/crispr-attempt/crispr-attempt.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MutagenesisDetailsComponent } from './components/crispr/mutagenesis-details/mutagenesis-details.component';
import { GenotypePrimersComponent } from './components/crispr/genotype-primers/genotype-primers.component';
import { MutagenesisDonorsComponent } from './components/crispr/mutagenesis-donors/mutagenesis-donors.component';

@NgModule({
  declarations: [
    CrisprAttemptComponent,
    CrisprAttemptDetailsComponent,
    MutagenesisDetailsComponent,
    GenotypePrimersComponent,
    MutagenesisDonorsComponent
  ],
  imports: [
    SharedModule,
    AttemptsRoutingModule
  ],
  exports: [
    CrisprAttemptComponent,
    CrisprAttemptDetailsComponent
  ]
})
export class AttemptsModule { }
