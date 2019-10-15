import { NgModule } from '@angular/core';
import { GeneComponent } from './components/gene/gene.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [GeneComponent],
  imports: [
    SharedModule
  ], exports: [
    GeneComponent
  ]
})
export class GenesModule { }
