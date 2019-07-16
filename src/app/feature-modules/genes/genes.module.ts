import { NgModule } from '@angular/core';
import { GenesRouting } from './genes.routing';
import { GeneSearchComponent } from './gene-search';
import { SharedModule } from 'src/app/shared/shared.module';

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
