import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { routing } from './app.routing';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { HomeComponent } from './home';
import { GeneSearchComponent } from './gene-search/gene-search.component';
import { ConfirmationComponent } from './shared/components/confirmation/confirmation.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { CrisprAttemptComponent } from './crispr-attempt/crispr-attempt.component';

import { fakeBackendProvider } from './_helpers/fake-backend';
import { BearerTokenAuthInterceptor, ErrorInterceptor } from './_helpers';
import { LoginModule } from './login/login.module';
import { ProjectsModule } from './projects/projects.module';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';


@NgModule({
    imports: [
        HttpClientModule,
        routing,
        NgMultiSelectDropDownModule.forRoot(),
        LoginModule,
        ProjectsModule,
        CoreModule,
        SharedModule,
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        GeneSearchComponent,
        HeaderComponent,
        FooterComponent,
        CrisprAttemptComponent
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: BearerTokenAuthInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

        fakeBackendProvider
    ],
    bootstrap: [AppComponent],
    entryComponents: [ConfirmationComponent]
})

export class AppModule {
    constructor() {
        console.log('[[AppModule loaded]]');
    }
}
