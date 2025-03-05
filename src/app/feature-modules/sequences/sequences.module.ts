import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { IndexedSequenceComponent } from './components/indexed-sequence/indexed-sequence.component';
import { IndexedLocationsComponent } from './components/indexed-locations/indexed-locations.component';
import { DeletionCoordinatesComponent } from './components/deletion-coordinates/deletion-coordinates.component';
import {TargetedExonsComponent} from "./components/targeted-exons/targeted-exons.component";

@NgModule({
  declarations: [ IndexedSequenceComponent, IndexedLocationsComponent,DeletionCoordinatesComponent,TargetedExonsComponent],
  imports: [
    SharedModule
  ], exports: [
    IndexedSequenceComponent,
    DeletionCoordinatesComponent,
    TargetedExonsComponent
  ]
})
export class SequencesModule { }
