import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PermissionsService } from 'src/app/core/services/permissions.service';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';


const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
  },
  {
    path: PermissionsService.UPDATE_USER,
    component: UserManagementComponent,
    canActivate: [AuthGuard]
  },
  {
    path: PermissionsService.REGISTER_USER,
    component: UserManagementComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
