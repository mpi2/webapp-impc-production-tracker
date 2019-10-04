import { NgModule } from '@angular/core';
import { SearchRouting } from './search.routing';
import { SharedModule } from 'src/app/shared/shared.module';
import { SearchComponent } from './components/search/search.component';

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
