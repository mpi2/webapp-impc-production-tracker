import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanLoad, Route, UrlSegment } from '@angular/router';
import { LoggedUserService } from '../services/logged-user.service';
import { Observable, of } from 'rxjs';
import { PermissionsService } from '../services/permissions.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanLoad {

    constructor(
        private router: Router,
        private loggedUserService: LoggedUserService,
        private permissionsService: PermissionsService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        const url = state.url;
        const path = route.routeConfig.path;
        console.log('url', url, 'path', path);

        const loggedUser = this.loggedUserService.getLoggerUser();
        console.log('loggedUser', loggedUser);

        if (!loggedUser) {
            console.log('NO LOGGED');
            this.redirectToLoginPage(url);
            return false;
        }

        if ('admin' === path) {
            return this.permissionsService.evaluateAdminPermission(PermissionsService.EXECUTE_MANAGER_TASKS);
        }

        if (url.indexOf('/admin/') >= 0) {
            return this.permissionsService.evaluateAdminPermission(path);
        } else {
            return true;
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
}
