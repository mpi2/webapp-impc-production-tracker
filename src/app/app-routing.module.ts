import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { NotFoundComponent } from './core/components/not-found/not-found.component';
import { GeneSearchComponent } from './feature-modules/genes/gene-search';
import { ReportsComponent } from './core/components/reports/reports.component';


const routes: Routes = [
  { path: '', component: GeneSearchComponent },
  { path: 'reports', component: ReportsComponent },
  {
    path: 'admin',
    loadChildren:  () => import('./feature-modules/admin/admin.module').then(m => m.AdminModule), canActivate:[AuthGuard], 
    canLoad: [AuthGuard]
  },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor() {
  }
 }
