import { RoleWorkUnit } from './role_work_unit';
import { RoleConsortium } from './role_consortium';

export class User {
    name: string;
    password: string;
    email: string;
    roleWorkUnits: RoleWorkUnit[];
    roleConsortia: RoleConsortium[];
}
