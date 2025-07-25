import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import {
  IndexedSequenceComponent,

} from './components/indexed-sequence/indexed-sequence.component';
import {InsertionSequenceComponent} from './components/insertion-sequence/insertion-sequence.component';
import { IndexedLocationsComponent } from './components/indexed-locations/indexed-locations.component';
import { DeletionCoordinatesComponent } from './components/deletion-coordinates/deletion-coordinates.component';
import {TargetedExonsComponent} from "./components/targeted-exons/targeted-exons.component";
import {CanonicalTargetedExonsComponent} from "./components/canonical-targeted-exons/canonical-targeted-exons.component";

@NgModule({
  declarations: [ IndexedSequenceComponent, InsertionSequenceComponent, IndexedLocationsComponent,DeletionCoordinatesComponent,TargetedExonsComponent,CanonicalTargetedExonsComponent],
  imports: [
    SharedModule
  ], exports: [
    IndexedSequenceComponent,
    InsertionSequenceComponent,
    DeletionCoordinatesComponent,
    TargetedExonsComponent,
    CanonicalTargetedExonsComponent
  ]
})
export class SequencesModule { }
