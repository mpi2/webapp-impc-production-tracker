import { NgModule } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoggedUserService } from './services/logged-user.service';
import { ConfigurationDataService } from './services/configuration-data.service';
import { PermissionsService } from './services/permissions.service';
import { FileLoaderService } from './services/file-loader.service';
import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { UpdateNotificationComponent } from '../feature-modules/plans/components/update-notification/update-notification.component';
import { ReportsComponent } from './components/reports/reports.component';


@NgModule({
  declarations: [HeaderComponent, FooterComponent, HomeComponent, NotFoundComponent, ReportsComponent],
  imports: [
    SharedModule
  ],
  providers: [
    LoggedUserService,
    ConfigurationDataService,
    PermissionsService,
    FileLoaderService
  ],
  exports: [HeaderComponent, FooterComponent],
  entryComponents: [UpdateNotificationComponent]
})
export class CoreModule { }
