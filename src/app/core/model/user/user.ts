import { RoleWorkUnit } from './role_work_unit';
import { RoleConsortium } from './role_consortium';
import { ActionPermission } from './action-permission';

export class User {
    name: string;
    password: string;
    email: string;
    isAdmin: boolean;
    roleWorkUnits: RoleWorkUnit[];
    roleConsortia: RoleConsortium[];
    actionPermissions: ActionPermission[];
}
