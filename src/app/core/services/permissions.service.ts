import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { Permission } from '../model/conf/permission';
import { map } from 'rxjs/operators';
import { ConfigAssetLoaderService } from './config-asset-loader.service';
import { ActionPermission } from '../model/user/action-permission';
import { User } from '../model/user/user';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {

  // Paths
  static readonly REGISTER_USER = 'register-user';
  static readonly UPDATE_USER = 'update-user/:id';
  static readonly EXECUTE_MANAGER_TASKS = 'execute-manager-tasks';

  // Actions
  static readonly UPDATE_PLAN_ACTION = 'canUpdatePlan';
  static readonly UPDATE_PROJECT_ACTION = 'canUpdateProject';

  private apiServiceUrl;

  constructor(private http: HttpClient, private configAssetLoaderService: ConfigAssetLoaderService) {
    this.configAssetLoaderService.getConfig().then(data => this.apiServiceUrl = data.appServerUrl);
  }

  static canExecuteManagerTasks(user: User) {
    const actionPermission: ActionPermission = user.actionPermissions.find(x => x.actionName === 'executeManagerTasks');
    return actionPermission.value;
  }

  static canManageUsers(user: User) {
    const actionPermission: ActionPermission = user.actionPermissions.find(x => x.actionName === 'manageUsers');
    return actionPermission.value;
  }


  // Returns an object with permissions for the logged user.
  getPermissions() {
    return this.http.get<Permission>(this.apiServiceUrl + '/api/permissions');
  }

  // Returns if an action over an object is allowed.
  getPermissionByActionOnResource(action: string, resourceId: string) {
    console.log('calling api permissionByActionOnResource for', action, resourceId);

    return this.http.get<boolean>(this.apiServiceUrl + '/api/permissionByActionOnResource?action='
      + action + '&resourceId=' + resourceId);
  }

  evaluatePermission(path: string): Observable<boolean> {
    console.log('evaluatePermission', path);

    let hasPermission: boolean;

    return this.getPermissions().pipe(map(v => {
      switch (path) {
        case PermissionsService.REGISTER_USER: case PermissionsService.UPDATE_USER:
          hasPermission = v.canRegisterUser;
          break;
        case PermissionsService.EXECUTE_MANAGER_TASKS:
          hasPermission = v.canExecuteManagerTasks;
          break;
        default:
          hasPermission = false;
      }
      return hasPermission;
    }));
  }

  evaluatePermissionByActionOnResource(action: string, resourceId: string): Observable<boolean> {
    return this.getPermissionByActionOnResource(action, resourceId);
  }
}
