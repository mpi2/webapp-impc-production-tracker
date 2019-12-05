import { NgModule } from '@angular/core';
import { FilterContainerComponent } from './components/filter-container/filter-container.component';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [FilterContainerComponent],
  imports: [
    SharedModule
  ],
  exports: [
    FilterContainerComponent
  ]
})
export class FiltersModule { }
