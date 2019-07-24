import { NgModule } from '@angular/core';
import { GenesRouting } from './genes.routing';
import { GeneSearchComponent } from './gene-search';
import { SharedModule } from 'src/app/shared/shared.module';

// import { MatExpansionPanel } from '@angular/material';

@NgModule({
  declarations: [
    GeneSearchComponent,
  ],
  imports: [
    SharedModule,
    GenesRouting
  ],
  exports: [
    // MatExpansionPanel,
  ]
})
export class GenesModule { }
