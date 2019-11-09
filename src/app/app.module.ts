import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor } from './core/helpers/error-interceptor';
import { BearerTokenAuth } from './core/helpers/bearer-token-auth';
import { LoginModule } from './feature-modules/login/login.module';
import { ProjectsModule } from './feature-modules/projects/projects.module';
import { PlansModule } from './feature-modules/plans/plans.module';
import { SearchModule } from './feature-modules/search/search.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfigAssetLoaderService } from './core/services/config-asset-loader.service';
import { GenesModule } from './feature-modules/genes/genes.module';
import { LocationsModule } from './feature-modules/locations/locations.module';
import { IntentionsModule } from './feature-modules/intentions/intentions.module';
import { TargetGeneListModule } from './feature-modules/target-gene-list/target-gene-list.module';

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
    SearchModule,
    GenesModule,
    IntentionsModule,
    LocationsModule,
    TargetGeneListModule,
    AppRoutingModule,
  ],
  exports: [
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: BearerTokenAuth, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    {
      provide: APP_INITIALIZER,
      useFactory: (configService: ConfigAssetLoaderService) => () => configService.getConfig(),
      deps: [ConfigAssetLoaderService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
