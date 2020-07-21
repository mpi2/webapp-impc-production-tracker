import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { GenesModule } from '../genes/genes.module';
import { SequencesModule } from '../sequences/sequences.module';
import { IntentionListComponent } from './components/intention-list/intention-list.component';
import { SequenceIntentionDetailComponent } from './components/sequence-intention-detail/sequence-intention-detail.component';

@NgModule({
  declarations: [
    IntentionListComponent,
    SequenceIntentionDetailComponent
  ],
  imports: [
    SharedModule,
    GenesModule,
    SequencesModule,
  ],
  exports: [
    IntentionListComponent,
    SequenceIntentionDetailComponent
  ]
})
export class IntentionsModule { }
