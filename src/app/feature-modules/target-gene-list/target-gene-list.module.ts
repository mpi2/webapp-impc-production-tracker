import { NgModule } from '@angular/core';

import { TargetGeneListRoutingModule } from './target-gene-list-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ListManagementComponent } from './components/list-management/list-management.component';
import { ListsImporterComponent } from './components/lists-importer/lists-importer.component';


@NgModule({
  declarations: [ListManagementComponent, ListsImporterComponent],
  imports: [
    TargetGeneListRoutingModule,
    SharedModule

  ]
})
export class TargetGeneListModule { }
