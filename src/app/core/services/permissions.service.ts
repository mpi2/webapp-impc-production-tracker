import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
  static readonly MANAGE_GENE_LISTS = 'canManageGeneLists';

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

  static canExecuteAction(user: User, action: string) {
    const actionPermission: ActionPermission = user.actionPermissions.find(x => x.actionName === action);
    return actionPermission.value;
  }

  // Returns if an action over an object is allowed.
  getPermissionByActionOnResource(action: string, resourceId: string) {
    return this.http.get<boolean>(this.apiServiceUrl + '/api/permissionByActionOnResource?action='
      + action + '&resourceId=' + resourceId);
  }

  evaluatePermissionByActionOnResource(action: string, resourceId: string): Observable<boolean> {
    return this.getPermissionByActionOnResource(action, resourceId);
  }
}
