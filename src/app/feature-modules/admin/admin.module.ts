import { NgModule } from '@angular/core';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserRegistrationComponent } from './user-registration/user-registration.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [DashboardComponent, UserRegistrationComponent],
  imports: [
    SharedModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
