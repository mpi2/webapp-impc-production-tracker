import { NgModule } from '@angular/core';

import { TargetGeneListRoutingModule } from './target-gene-list-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ListManagementComponent } from './components/list-management/list-management.component';
import { AutocompleteGeneInputsComponent } from './components/autocomplete-gene-inputs/autocomplete-gene-inputs.component';

@NgModule({
  declarations: [ListManagementComponent, AutocompleteGeneInputsComponent],
  imports: [
    TargetGeneListRoutingModule,
    SharedModule
  ]
})
export class TargetGeneListModule { }
