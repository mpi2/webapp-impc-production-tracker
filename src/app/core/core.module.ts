import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoggedUserService } from './services/logged-user.service';
import { ConfigurationDataService } from './services/configuration-data.service';
import { BasicDataService } from './services/basic-data.service';
import { PermissionsService } from './services/permissions.service';

@NgModule({
  declarations: [],
  providers: [
    LoggedUserService,
    BasicDataService,
    ConfigurationDataService,
    PermissionsService
  ],
  imports: [
    CommonModule
  ]
})
export class CoreModule { }
