import { NgModule } from '@angular/core';

import { TargetGeneListRoutingModule } from './target-gene-list-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ListManagementComponent } from './components/list-management/list-management.component';

@NgModule({
  declarations: [ListManagementComponent],
  imports: [
    TargetGeneListRoutingModule,
    SharedModule
  ]
})
export class TargetGeneListModule { }
