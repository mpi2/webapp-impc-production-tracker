import { BrowserModule } from '@angular/platform-browser';
import { NgModule, inject, provideAppInitializer } from '@angular/core';
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
import { SequencesModule } from './feature-modules/sequences/sequences.module';
import { IntentionsModule } from './feature-modules/intentions/intentions.module';
import { TargetGeneListModule } from './feature-modules/target-gene-list/target-gene-list.module';
import { UsersModule } from './feature-modules/users/users.module';

import { BASE_API_URL_TOKEN } from './injectors';
import { NgChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, // Here to prevent double instantiation of BrowserModule
    BrowserAnimationsModule, // Here to prevent double instantiation of BrowserAnimation
    CoreModule,
    SharedModule,
    LoginModule,
    UsersModule,
    ProjectsModule,
    PlansModule,
    SearchModule,
    GenesModule,
    IntentionsModule,
    SequencesModule,
    TargetGeneListModule,
    AppRoutingModule,
    NgChartsModule,
  ],
  exports: [
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: BearerTokenAuth, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    provideAppInitializer(() => {
        const initializerFn = ((configService: ConfigAssetLoaderService) => () => configService.getConfig())(inject(ConfigAssetLoaderService));
        return initializerFn();
      }),
    {
      provide: BASE_API_URL_TOKEN,
      useFactory: (config: ConfigAssetLoaderService) => config.baseUrl,
      deps: [ConfigAssetLoaderService],
    },
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
