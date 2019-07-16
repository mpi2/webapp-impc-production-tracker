import { NgModule } from '@angular/core';

import { AttemptsRoutingModule } from './attempts-routing.module';
import { CrisprAttemptDetailsComponent } from './components/crispr/crispr-attempt-details/crispr-attempt-details.component';
import { CrisprAttemptComponent } from './components/crispr/crispr-attempt/crispr-attempt.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    CrisprAttemptComponent,
    CrisprAttemptDetailsComponent
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
