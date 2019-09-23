import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
//import { fakeBackendProvider } from './core/helpers/fake-backend.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor } from './core/helpers/error-interceptor';
import { BearerTokenAuth } from './core/helpers/bearer-token-auth';
import { LoginModule } from './feature-modules/login/login.module';
import { ProjectsModule } from './feature-modules/projects/projects.module';
import { PlansModule } from './feature-modules/plans/plans.module';
import { GenesModule } from './feature-modules/genes/genes.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfigAssetLoaderService } from './core/services/config-asset-loader.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule, // Here to prevent double instantiation of BrowserAnimation
    CoreModule,
    SharedModule,
    LoginModule,
    ProjectsModule,
    PlansModule,
    GenesModule,
    AppRoutingModule,
  ],
  exports: [
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: BearerTokenAuth, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    {
      provide: APP_INITIALIZER,
      useFactory: (configService: ConfigAssetLoaderService) => () => configService.loadConfigurations().toPromise(),
      deps: [ConfigAssetLoaderService],
      multi: true
    }

    //fakeBackendProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
