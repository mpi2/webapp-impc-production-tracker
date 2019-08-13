import { StatusDate } from '../../projects';
import { CrisprAttempt } from '../../attempts';

export class Plan {
    id: number;
    pin: string;
    project_id: number;
    tpn: string;
    funder_name: string;
    consortium_name: string;
    work_group_name: string;
    work_unit_name: string;
    is_active: boolean;
    status_name: string;
    status_dates: StatusDate[];
    type_name: string;
    privacy_name: string;
    parent_colony_name: string;
    comment: string;
    products_available_for_general_public: boolean;
    crispr_attempt_attributes: CrisprAttempt;
}