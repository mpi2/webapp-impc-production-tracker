import { RoleWorkUnit } from './role_work_unit';
import { RoleConsortium } from './role_consortium';
import { ActionPermission } from './action-permission';

export class User {
    name: string;
    email: string;
    isAdmin: boolean;
    contactable: boolean;
    rolesWorkUnits: RoleWorkUnit[];
    rolesConsortia: RoleConsortium[];
    actionPermissions: ActionPermission[];
    currentPassword: string;
    newPassword: string;
    password: string; // For creation

    constructor() {
        this.name = '';
        this.email = '';
        this.isAdmin = false;
        this.rolesWorkUnits = [];
        this.rolesConsortia = [];
        this.actionPermissions = [];
    }
}
