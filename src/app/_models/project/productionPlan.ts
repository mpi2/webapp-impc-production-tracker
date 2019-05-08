import { PlanDetails } from './planDetails';
import { ProductionPlanSummary } from './productionPlanSummary';

export class ProductionPlan {
    planDetails: PlanDetails = new PlanDetails();
    productionPlanSummary: ProductionPlanSummary = new ProductionPlanSummary();
}