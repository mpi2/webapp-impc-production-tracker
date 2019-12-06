import { NgModule } from '@angular/core';

import { TargetGeneListRoutingModule } from './target-gene-list-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ListManagementComponent } from './components/list-management/list-management.component';
import { AutocompleteGeneInputsComponent } from './components/autocomplete-gene-inputs/autocomplete-gene-inputs.component';
import { ImportListDialogComponent } from './components/import-list-dialog/import-list-dialog.component';
import { ProjectCardComponent } from './components/project-card/project-card.component';
import { PlanCardComponent } from './components/plan-card/plan-card.component';
import { FiltersModule } from '../filters/filters.module';
import { ConsortiumSelectorComponent } from './components/consortium-selector/consortium-selector.component';
import { ListContentComponent } from './components/list-content/list-content.component';
import { ListControlsComponent } from './components/list-controls/list-controls.component';

@NgModule({
  declarations: [
    ListManagementComponent,
    AutocompleteGeneInputsComponent,
    ImportListDialogComponent,
    ProjectCardComponent,
    PlanCardComponent,
    ConsortiumSelectorComponent,
    ListContentComponent,
    ListControlsComponent],
  imports: [
    TargetGeneListRoutingModule,
    SharedModule,
    FiltersModule
  ],
  entryComponents: [
    ImportListDialogComponent
  ]
})
export class TargetGeneListModule { }
