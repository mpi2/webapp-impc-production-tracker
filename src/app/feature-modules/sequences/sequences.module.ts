import { NgModule } from '@angular/core';
import { SequenceComponent } from './components/sequence/sequence.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { IndexedSequenceComponent } from './components/indexed-sequence/indexed-sequence.component';

@NgModule({
  declarations: [SequenceComponent, IndexedSequenceComponent],
  imports: [
    SharedModule
  ], exports: [
    SequenceComponent,
    IndexedSequenceComponent
  ]
})
export class SequencesModule { }
