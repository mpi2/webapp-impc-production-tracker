import { NgModule } from '@angular/core';
import { SequenceComponent } from './components/sequence/sequence.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [SequenceComponent],
  imports: [
    SharedModule
  ], exports: [
    SequenceComponent
  ]
})
export class SequencesModule { }
