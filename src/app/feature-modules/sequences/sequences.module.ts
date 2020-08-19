import { NgModule } from '@angular/core';
import { SequenceComponent } from './components/sequence/sequence.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { IndexedSequenceComponent } from './components/indexed-sequence/indexed-sequence.component';
import { IndexedLocationsComponent } from './components/indexed-locations/indexed-locations.component';

@NgModule({
  declarations: [SequenceComponent, IndexedSequenceComponent, IndexedLocationsComponent],
  imports: [
    SharedModule
  ], exports: [
    SequenceComponent,
    IndexedSequenceComponent
  ]
})
export class SequencesModule { }
