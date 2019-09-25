import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { LoggedUserService, PermissionsService } from '..';
import { LoggedUser } from '../model/user/logged-user';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {
    loggedUser: LoggedUser;

    constructor(
        private router: Router,
        private loggedUserService: LoggedUserService,
        private permissionsService: PermissionsService) {
    }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        const url = state.url;
        const path = next.routeConfig.path;
        return this.canPathBeActivated(path, url);
    }

    canPathBeActivated(path, url): Observable<boolean> {        
        if ('admin' === path) {
            return this.permissionsService.evaluatePermission(PermissionsService.EXECUTE_MANAGER_TASKS);
        }
        if (url.indexOf('/admin/') >= 0) {
            return this.permissionsService.evaluatePermission(path);
        } else {
            return of(true);
        }
    }

    canLoad(
        route: Route,
        segments: UrlSegment[]): Observable<boolean> {
        const path = route.path;
        let canLoad: boolean = false;

        return this.loggedUserService.getLoggerUser().pipe(
            map(user => {
                if (user) {
                    return this.canPathBeLoaded(user, path);
                } else {
                    return false;
                }
            })
        );
    }

    canPathBeLoaded(loggedUser: LoggedUser, path): boolean {
        let canVisit: boolean;
        if ('admin' === path) {
            if (loggedUser) {
                canVisit = loggedUser.admin /// Or Manager??
            } else {
                canVisit = false;
            }
        } else {
            canVisit = true;
        }
        return canVisit;
    }

    redirectToLoginPage(url) {
        this.router.navigate(['/login'], { queryParams: { returnUrl: url } });
    }
}
