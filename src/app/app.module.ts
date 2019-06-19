import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { routing } from './app.routing';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { DropdownModule} from 'primeng/dropdown';
import { MultiSelectModule} from 'primeng/multiselect';
import { PaginatorModule} from 'primeng/paginator';

import { BearerTokenAuthInterceptor, ErrorInterceptor } from './_helpers';
import { HomeComponent } from './home';
import { GeneSearchComponent } from './gene-search/gene-search.component';
import { fakeBackendProvider } from './_helpers/fake-backend';
import { ConfirmationComponent } from './shared/confirmation/confirmation.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { CrisprAttemptComponent } from './crispr-attempt/crispr-attempt.component';
import { CreateProjectComponent } from './create-project/create-project.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';


import { LoginModule } from './login/login.module';
import { ProjectsModule } from './projects/projects.module';


@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        routing,
        NgMultiSelectDropDownModule.forRoot(),
        NgbModule,
        NgxPaginationModule,
        AutocompleteLibModule,
        DropdownModule,
        MultiSelectModule,
        PaginatorModule,
        LoginModule,
        ProjectsModule
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        GeneSearchComponent,
        ConfirmationComponent,
       // ProjectsComponent,
        HeaderComponent,
        FooterComponent,
        CrisprAttemptComponent,
        CreateProjectComponent
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
        console.log('AppModule loaded.');
     }
}
