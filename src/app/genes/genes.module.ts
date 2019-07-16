import { NgModule } from '@angular/core';
import { GenesRouting } from './genes.routing';
import { SharedModule } from '../shared/shared.module';
import { GeneSearchComponent } from './gene-search';

@NgModule({
  declarations: [
    GeneSearchComponent
  ],
  imports: [
    SharedModule,
    GenesRouting
  ]
})
export class GenesModule { }
