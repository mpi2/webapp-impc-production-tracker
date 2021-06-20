import { NgModule } from '@angular/core';

import { AttemptsRoutingModule } from './attempts-routing.module';
import { CrisprAttemptDetailsComponent } from './components/production/crispr/crispr-attempt-details/crispr-attempt-details.component';
import { CrisprAttemptComponent } from './components/production/crispr/crispr-attempt/crispr-attempt.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MutagenesisDetailsComponent } from './components/production/crispr/mutagenesis-details/mutagenesis-details.component';
import { GenotypePrimersComponent } from './components/production/crispr/genotype-primers/genotype-primers.component';
import { MutagenesisDonorsComponent } from './components/production/crispr/mutagenesis-donors/mutagenesis-donors.component';
import { PhenotypingAttemptComponent } from './components/phenotyping/phenotyping-attempt/phenotyping-attempt.component';
// eslint-disable-next-line max-len
import { TissueDistributionCentreComponent } from './components/phenotyping/tissue-distribution-centre/tissue-distribution-centre.component';
import { ReagentsComponent } from './components/production/crispr/reagents/reagents.component';
import { AssayComponent } from './components/production/crispr/assay/assay.component';
import { InjectionDetailsComponent } from './components/production/crispr/injection-details/injection-details.component';
import { GuidesComponent } from './components/production/crispr/guides/guides.component';
import { NucleaseComponent } from './components/production/crispr/nuclease/nuclease.component';
import { EscellAttemptComponent } from './components/production/es_cell/escell-attempt.component';
// eslint-disable-next-line max-len
import { PhenotypingAttemptDetailsComponent } from './components/phenotyping/phenotyping-attempt-details/phenotyping-attempt-details.component';
import { PhenotypingStagesComponent } from './components/phenotyping/phenotyping-stages/phenotyping-stages.component';
import { PhenotypingStageDetailsComponent } from './components/phenotyping/phenotyping-stage-details/phenotyping-stage-details.component';

@NgModule({
  declarations: [
    CrisprAttemptComponent,
    CrisprAttemptDetailsComponent,
    MutagenesisDetailsComponent,
    GenotypePrimersComponent,
    MutagenesisDonorsComponent,
    PhenotypingAttemptComponent,
    TissueDistributionCentreComponent,
    ReagentsComponent,
    AssayComponent,
    InjectionDetailsComponent,
    PhenotypingAttemptDetailsComponent,
    PhenotypingStagesComponent,
    PhenotypingStageDetailsComponent,
    GuidesComponent,
    NucleaseComponent,
    EscellAttemptComponent
  ],
  imports: [
    SharedModule,
    AttemptsRoutingModule
  ],
  exports: [
    CrisprAttemptComponent,
    CrisprAttemptDetailsComponent,
    EscellAttemptComponent,
    PhenotypingAttemptComponent
  ]
})
export class AttemptsModule { }
