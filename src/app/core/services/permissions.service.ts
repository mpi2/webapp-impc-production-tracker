import { Injectable } from '@angular/core';
import { BasicDataService } from './basic-data.service';
import { Observable } from 'rxjs';

@Injectable()
export class PermissionsService {

    // Paths
    static readonly REGISTER_USER = 'register-user';
    static readonly EXECUTE_MANAGER_TASKS = 'execute-manager-tasks';

    // Actions
    static readonly UPDATE_PLAN_ACTION = 'canUpdatePlan';

    constructor(private basicDataService: BasicDataService) { }

    evaluatePermission(path: string): Observable<boolean> {
        let hasPermission: boolean;
        return this.basicDataService.getPermissions().map(v => {
            switch (path) {
                case PermissionsService.REGISTER_USER:
                    hasPermission = v.canRegisterUser;
                    break;
                case PermissionsService.EXECUTE_MANAGER_TASKS:
                    hasPermission = v.canExecuteManagerTasks;
                    break;
                default:
                    hasPermission = false;
            }
            return hasPermission;
        });
    }

    evaluatePermissionByActionOnResource(action: string, resourceId: string): Observable<boolean> {
        return this.basicDataService.getPermissionByActionOnResource(action, resourceId);
    }
}