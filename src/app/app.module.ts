import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { routing } from './app.routing';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';

import {
    AuthModule
} from 'angular-aap-auth';
import {
    JwtModule
} from '@auth0/angular-jwt';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { RegistrationFormComponent } from './registration-form/registration-form.component';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';


export function getToken(): string {
    return localStorage.getItem('jwt_token') || '';
}
export function updateToken(newToken: string): void {
    return localStorage.setItem('jwt_token', newToken);
}
// Optional
export function removeToken(): void {
    return localStorage.removeItem('jwt_token');
}

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        routing,
        NgbModule,
        AuthModule.forRoot({
            aapURL: 'https://api.aai.ebi.ac.uk',
            tokenGetter: getToken,
            tokenUpdater: updateToken,
            tokenRemover: removeToken // Optional
        }), // Defaults to localStorage `id_token` key.
        JwtModule.forRoot({
            config: {
                tokenGetter: getToken,
            }
        }),
        BrowserModule,
        BsDropdownModule.forRoot(),
        TooltipModule.forRoot(),
        ModalModule.forRoot()
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        LoginComponent,
        RegistrationFormComponent
    ],
    providers: [],
    bootstrap: [AppComponent]
})

export class AppModule { }
