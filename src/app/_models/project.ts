import { ProductionPlanSummary } from './productionPlanSummary';
import { PhenotypePlanSummary } from './phenotypePlanSummary';

export class Project {
    tpn: string;
    assigmentStatusName: string;
    productionPlanSummaries: ProductionPlanSummary[];
    phenotypePlanSummaries: PhenotypePlanSummary[];
}
