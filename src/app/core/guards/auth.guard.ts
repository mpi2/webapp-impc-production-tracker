import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoggedUserService, PermissionsService } from '..';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(
    private router: Router,
    private loggedUserService: LoggedUserService,
    private permissionsService: PermissionsService) { }
    
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const url = state.url;
      const path = next.routeConfig.path;
      const loggedUser = this.loggedUserService.getLoggerUser();

      if (!loggedUser) {
          this.redirectToLoginPage(url);
          return false;
      }

      if ('admin' === path) {
          return this.permissionsService.evaluatePermission(PermissionsService.EXECUTE_MANAGER_TASKS);
      }

      if (url.indexOf('/admin/') >= 0) {
          return this.permissionsService.evaluatePermission(path);
      } else {
          return true;
      }
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
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

  redirectToLoginPage(url) {
    this.router.navigate(['/login'], { queryParams: { returnUrl: url } });
}
}
