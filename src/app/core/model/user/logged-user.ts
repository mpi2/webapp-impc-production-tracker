import { RoleWorkUnit } from './role_work_unit';
import { RoleConsortium } from './role_consortium';

/**
 * Basic information for a user that is logged into the application.
 */
export class LoggedUser {
    userName: string;
    admin: boolean;
    rolesWorkUnits: RoleWorkUnit[];
    rolesConsortia: RoleConsortium[];
}
