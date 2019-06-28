import { PlanDetails } from '../plan-details';
import { Attempt } from './attempt';
import { PlanHistory } from '../plan-history';

export class ProductionPlan {
    planDetails: PlanDetails = new PlanDetails();
    attempt: Attempt = new Attempt();
    history: PlanHistory[] = [];
}
