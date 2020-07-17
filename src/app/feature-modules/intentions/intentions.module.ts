import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { GenesModule } from '../genes/genes.module';
import { SequencesModule } from '../sequences/sequences.module';
import { IntentionListComponent } from './components/intention-list/intention-list.component';

@NgModule({
  declarations: [
    IntentionListComponent
  ],
  imports: [
    SharedModule,
    GenesModule,
    SequencesModule,
  ],
  exports: [
    IntentionListComponent
  ]
})
export class IntentionsModule { }
