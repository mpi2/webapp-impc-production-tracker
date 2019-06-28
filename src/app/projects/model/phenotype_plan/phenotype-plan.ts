import { PlanDetails } from '../plan-details';
import { PlanHistory } from '../plan-history';

export class PhenotypePlan {
    planDetails: PlanDetails = new PlanDetails();
    productionPlanReference: string;
    phenotypingProduction: {};
    history: PlanHistory[] = [];
}
