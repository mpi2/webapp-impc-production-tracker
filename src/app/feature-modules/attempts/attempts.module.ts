import { NgModule } from '@angular/core';

import { AttemptsRoutingModule } from './attempts-routing.module';
import { CrisprAttemptDetailsComponent } from './components/production/crispr/crispr-attempt-details/crispr-attempt-details.component';
import { CrisprAttemptComponent } from './components/production/crispr/crispr-attempt/crispr-attempt.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MutagenesisDetailsComponent } from './components/production/crispr/mutagenesis-details/mutagenesis-details.component';
import { GenotypePrimersComponent } from './components/production/crispr/genotype-primers/genotype-primers.component';
import { MutagenesisDonorsComponent } from './components/production/crispr/mutagenesis-donors/mutagenesis-donors.component';
import { GuidesComponent } from './components/production/crispr/guides/guides.component';
import { PhenotypingAttemptComponent } from './components/phenotyping/phenotyping-attempt/phenotyping-attempt.component';
// tslint:disable-next-line:max-line-length
import { TissueDistributionCentreComponent } from './components/phenotyping/tissue-distribution-centre/tissue-distribution-centre.component';
import { NucleaseComponent } from './components/production/crispr/nuclease/nuclease.component';
import { ReagentsComponent } from './components/production/crispr/reagents/reagents.component';
import { AssayComponent } from './components/production/crispr/assay/assay.component';
import { InjectionDetailsComponent } from './components/production/crispr/injection-details/injection-details.component';

@NgModule({
  declarations: [
    CrisprAttemptComponent,
    CrisprAttemptDetailsComponent,
    MutagenesisDetailsComponent,
    GenotypePrimersComponent,
    MutagenesisDonorsComponent,
    GuidesComponent,
    PhenotypingAttemptComponent,
    TissueDistributionCentreComponent,
    NucleaseComponent,
    ReagentsComponent,
    AssayComponent,
    InjectionDetailsComponent
  ],
  imports: [
    SharedModule,
    AttemptsRoutingModule
  ],
  exports: [
    CrisprAttemptComponent,
    CrisprAttemptDetailsComponent,
    PhenotypingAttemptComponent
  ]
})
export class AttemptsModule { }
