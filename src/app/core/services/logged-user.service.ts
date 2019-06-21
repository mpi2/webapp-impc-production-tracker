import { Injectable } from '@angular/core';
import { LoggedUser } from '../model/logged-user';
import { MessageService } from './message.service';
import { Permission } from '../model/permission';
import { BasicDataService } from './basic-data.service';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

@Injectable()
export class LoggedUserService {

    private loggedUser: LoggedUser;
    readonly TOKEN_INFO_KEY = 'tokenInfo';

    constructor(private messageService: MessageService, private basicDataService: BasicDataService) {
    }

    getAccessToken() {
        const logginInfo = JSON.parse(sessionStorage.getItem(this.TOKEN_INFO_KEY));
        let token = null;
        if (logginInfo) {
            token = logginInfo.access_token;
        }
        return token;
    }

    storeLoggedUser(userInfo: any) {
        sessionStorage.setItem(this.TOKEN_INFO_KEY, JSON.stringify(userInfo));
        this.messageService.setUserLoggedIn(true);
    }

    removeLoggedUser() {
        sessionStorage.removeItem(this.TOKEN_INFO_KEY);
    }

    readLoggedUser() {
        const tokenInfo = JSON.parse(sessionStorage.getItem(this.TOKEN_INFO_KEY));
        if (tokenInfo) {
            this.loggedUser = new LoggedUser();
            this.loggedUser.role = tokenInfo.role;
            this.loggedUser.userName = tokenInfo.username;
            this.loggedUser.workUnitName = tokenInfo.workUnitName;
        } else {
            this.loggedUser = null;
        }
    }

    getLoggerUser() {
        this.readLoggedUser();
        return this.loggedUser;
    }

    evaluatePermission(action: string): Observable<boolean> {
        return this.basicDataService.getPermissions().map(v => {
            switch (action) {
                case 'register-user':
                    return !v.canRegisterUser;
                    break;
                default:
                    return false;
            }
        });
    }

}