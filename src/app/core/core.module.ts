import { NgModule } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoggedUserService } from './services/logged-user.service';
import { ConfigurationDataService } from './services/configuration-data.service';
import { PermissionsService } from './services/permissions.service';
import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { UpdateNotificationComponent } from '../feature-modules/plans/components/update-notification/update-notification.component';
import { ReportsComponent } from './components/reports/reports.component';
import {NgChartsModule} from "ng2-charts";
import {NgxSkeletonLoaderModule} from "ngx-skeleton-loader";


@NgModule({
  declarations: [HeaderComponent, FooterComponent, HomeComponent, NotFoundComponent, ReportsComponent],
  imports: [
    SharedModule,
    NgChartsModule,
    NgxSkeletonLoaderModule
  ],
  providers: [
    LoggedUserService,
    ConfigurationDataService,
    PermissionsService
  ],
  exports: [HeaderComponent, FooterComponent],
})
export class CoreModule { }
