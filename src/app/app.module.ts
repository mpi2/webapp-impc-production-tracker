import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { routing } from './app.routing';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { ConfirmationComponent } from './shared/components/confirmation/confirmation.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

import { fakeBackendProvider } from './_helpers/fake-backend';
import { BearerTokenAuthInterceptor, ErrorInterceptor } from './_helpers';
import { LoginModule } from './login/login.module';
import { ProjectsModule } from './projects/projects.module';
import { GenesModule } from './genes/genes.module';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { PlansModule } from './plans/plans.module';
import { HomeComponent } from './home/home.component';
import { HistoryComponent } from './shared/components/history/history.component';
import { AttemptsModule } from './attempts/attempts.module';

@NgModule({
    imports: [
        HttpClientModule,
        routing,
        NgMultiSelectDropDownModule.forRoot(),
        LoginModule,
        ProjectsModule,
        PlansModule,
        AttemptsModule,
        GenesModule,
        CoreModule,
        SharedModule,
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        HeaderComponent,
        FooterComponent
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: BearerTokenAuthInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

        fakeBackendProvider
    ],
    bootstrap: [AppComponent],
    entryComponents: [ConfirmationComponent, HistoryComponent]
})

export class AppModule {
    constructor() {
        console.log('[[AppModule loaded]]');
    }
}
