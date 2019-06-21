import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanLoad, Route, UrlSegment } from '@angular/router';
import { LoggedUserService } from '../services/logged-user.service';
import { Observable, of } from 'rxjs';
import { BasicDataService } from '../services/basic-data.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanLoad {

    constructor(
        private router: Router,
        private loggedUserService: LoggedUserService,
        private basicDataService: BasicDataService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        const url = state.url;
        const path = route.routeConfig.path;
        const loggedUser = this.loggedUserService.getLoggerUser();
        console.log(loggedUser);

        console.log('url', url, 'path', path);

        if (!loggedUser) {
            console.log('NO LOGGED');
            this.redirectToLoginPage(url);
            return false;
        }

        if ('admin' === path) {
            console.log('check execute-manager-tasks');
            this.evaluateAdminPermission('execute-manager-tasks').subscribe(v => console.log('execute-manager-tasks', v)
            )

            return this.evaluateAdminPermission('execute-manager-tasks');
        }

        if (url.indexOf('/admin/') >= 0) {
            console.log('Adminn');

            return this.evaluateAdminPermission(path);
        }
    }

    redirectToLoginPage(url) {
        this.router.navigate(['/login'], { queryParams: { returnUrl: url } });
    }

    canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
        const path = route.path;
        let canLoad: boolean;
        if ('admin' === path) {
            const loggedUser = this.loggedUserService.getLoggerUser();
            if (loggedUser) {
                canLoad = 'admin' === loggedUser.role; /// Or Manager??
            } else {
                canLoad = false;
            }
        } else {
            canLoad = true;
        }
        if (!canLoad) {
            console.error('Module not loaded because the user does not have permissions.');
        }

        return canLoad;
    }

    evaluateAdminPermission(path: string): Observable<boolean> {
        let canAccess: boolean;
        return this.basicDataService.getPermissions().map(v => {
            switch (path) {
                case 'register-user':
                    canAccess = v.canRegisterUser;
                    break;
                case 'execute-manager-tasks':
                    canAccess = v.canExecuteManagerTasks;
                    break;
                default:
                    canAccess = false;
            }
            return canAccess;
        });
    }
}
