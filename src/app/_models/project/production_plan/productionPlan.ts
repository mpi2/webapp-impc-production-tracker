import { PlanDetails } from '../planDetails';
import { Attempt } from './attempt';

export class ProductionPlan {
    planDetails: PlanDetails = new PlanDetails();
    attempt: Attempt = new Attempt();
}
