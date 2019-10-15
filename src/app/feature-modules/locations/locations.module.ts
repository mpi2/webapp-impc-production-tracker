import { NgModule } from '@angular/core';
import { LocationComponent } from './components/location/location.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [LocationComponent],
  imports: [
    SharedModule
  ], exports: [
    LocationComponent
  ]
})
export class LocationsModule { }
