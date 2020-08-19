import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { IndexedSequenceComponent } from './components/indexed-sequence/indexed-sequence.component';
import { IndexedLocationsComponent } from './components/indexed-locations/indexed-locations.component';

@NgModule({
  declarations: [ IndexedSequenceComponent, IndexedLocationsComponent],
  imports: [
    SharedModule
  ], exports: [
    IndexedSequenceComponent
  ]
})
export class SequencesModule { }
