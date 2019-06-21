import { Injectable } from '@angular/core';
import { BasicDataService } from './basic-data.service';
import { Observable } from 'rxjs';

@Injectable()
export class PermissionsService {

    static readonly REGISTER_USER = 'register-user';
    static readonly EXECUTE_MANAGER_TASKS = 'execute-manager-tasks';

    constructor(private basicDataService: BasicDataService) { }

    evaluateAdminPermission(path: string): Observable<boolean> {
        let canAccess: boolean;
        return this.basicDataService.getPermissions().map(v => {
            switch (path) {
                case PermissionsService.REGISTER_USER:
                    canAccess = v.canRegisterUser;
                    break;
                case PermissionsService.EXECUTE_MANAGER_TASKS:
                    canAccess = v.canExecuteManagerTasks;
                    break;
                default:
                    canAccess = false;
            }
            return canAccess;
        });
    }
}