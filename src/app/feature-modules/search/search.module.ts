import { NgModule } from '@angular/core';
import { SearchRouting } from './search.routing';
import { SharedModule } from 'src/app/shared/shared.module';
import { SearchComponent } from './components/search/search.component';
import { SearchInputComponent } from './components/search-input/search-input.component';
import { FiltersModule } from '../filters/filters.module';
import { SearchContentComponent } from './components/search-content/search-content.component';

// import { MatExpansionPanel } from '@angular/material';

@NgModule({
  declarations: [
    SearchComponent,
    SearchInputComponent,
    SearchContentComponent,
  ],
  imports: [
    SharedModule,
    FiltersModule,
    SearchRouting
  ],
  exports: [
    // MatExpansionPanel,
  ]
})
export class SearchModule { }
