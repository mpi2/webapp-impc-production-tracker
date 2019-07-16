import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { LoginComponent } from './login/login.component';
import { LoginRouting } from './login.routing';

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LoginRouting
  ],
  exports: [
    LoginComponent
  ]
})
export class LoginModule { 
  constructor() {
    console.log('[[LoginModule loaded]]');
  }
}
