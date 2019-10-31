import { RoleWorkUnit } from './role_work_unit';
import { RoleConsortium } from './role_consortium';
import { ActionPermission } from './action-permission';

export class User {
    name: string;
    password: string;
    email: string;
    isAdmin: boolean;
    rolesWorkUnits: RoleWorkUnit[];
    rolesConsortia: RoleConsortium[];
    actionPermissions: ActionPermission[];

    constructor() {
        this.name = '';
        this.password = null;
        this.email = '';
        this.isAdmin = false;
        this.rolesWorkUnits = [];
        this.rolesConsortia = [];
        this.actionPermissions = [];
    }
}
