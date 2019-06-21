import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistrationComponent } from './registration/registration.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminRouting } from './admin.routing';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  declarations: [RegistrationComponent, DashboardComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule.forRoot(),
    AdminRouting
  ]
})
export class AdminModule { 
  constructor() {
    console.log('AdminModule loaded.');
  }
}
