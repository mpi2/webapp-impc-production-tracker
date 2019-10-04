import { NgModule } from '@angular/core';
import { SearchRouting } from './search.routing';
import { SearchComponent } from './search';
import { SharedModule } from 'src/app/shared/shared.module';

// import { MatExpansionPanel } from '@angular/material';

@NgModule({
  declarations: [
    SearchComponent,
  ],
  imports: [
    SharedModule,
    SearchRouting
  ],
  exports: [
    // MatExpansionPanel,
  ]
})
export class SearchModule { }
