import { RoleWorkUnit } from './role_work_unit';
import { RoleConsortium } from './role_consortium';

/**
 * Basic information for a user that is logged into the application.
 */
export class LoggedUser {
    role: string;
    userName: string;
    workUnitName: string;
    rolesWorkUnits: RoleWorkUnit[];
    rolesConsortia: RoleConsortium[];
}
