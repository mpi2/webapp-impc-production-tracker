import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { IntentionBySequenceComponent } from './components/intention-by-sequence/intention-by-sequence.component';
import { GenesModule } from '../genes/genes.module';
import { SequencesModule } from '../sequences/sequences.module';
import { IntentionByGeneListComponent } from './components/intention-by-gene-list/intention-by-gene-list.component';
import { IntentionBySequenceListComponent } from './components/intention-by-sequence-list/intention-by-sequence-list.component';

@NgModule({
  declarations: [
    IntentionByGeneListComponent,
    IntentionBySequenceComponent,
    IntentionBySequenceListComponent
  ],
  imports: [
    SharedModule,
    GenesModule,
    SequencesModule,
  ],
  exports: [
    IntentionByGeneListComponent,
    IntentionBySequenceComponent,
    IntentionBySequenceListComponent
  ]
})
export class IntentionsModule { }
