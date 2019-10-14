import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { NotFoundComponent } from './core/components/not-found/not-found.component';
import { ReportsComponent } from './core/components/reports/reports.component';
import { SearchComponent } from './feature-modules/search/components/search/search.component';


const routes: Routes = [
  { path: '', component: SearchComponent },
  { path: 'reports', component: ReportsComponent },
  {
    path: 'admin',
    loadChildren:  () => import('./feature-modules/admin/admin.module').then(m => m.AdminModule), canActivate: [AuthGuard],
    canLoad: [AuthGuard]
  },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false, useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {
 }
