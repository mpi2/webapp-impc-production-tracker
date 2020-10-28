import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListManagementComponent } from './components/list-management/list-management.component';
import { PublicGeneListsComponent } from './components/public-gene-lists/public-gene-lists.component';


const routes: Routes = [
  {
    path: 'your-gene-list', component: ListManagementComponent
  },
  {
    path: 'public-gene-lists', component: PublicGeneListsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TargetGeneListRoutingModule { }
