import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './core/components/home/home.component';
import { AuthGuard } from './core/guards/auth.guard';
import { NotFoundComponent } from './core/components/not-found/not-found.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'admin',
    loadChildren:  () => import('./feature-modules/admin/admin.module').then(m => m.AdminModule), canActivate:[AuthGuard], canLoad: [AuthGuard]
  },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor() {
    console.log('[[AppRoutingModule loaded]]');
  }
    
 }
