import { StatusDate, IntentionByGeneAttribute, IntentionByLocationAttribute } from '..';
import { ProjectLinks } from './project-links';

export class Project {
    id: number;
    tpn: string;
    privacy_name: string;
    assignment_status_name: string;
    assignment_status_dates: StatusDate[];
    withdrawn: boolean;
    recovery: boolean;
    intention_by_gene_attributes: IntentionByGeneAttribute[];
    intention_by_location_attributes: IntentionByLocationAttribute[];
    imits_mi_plan_id: number;
    comment: string;
    is_active: boolean;
    _links: ProjectLinks;
}
