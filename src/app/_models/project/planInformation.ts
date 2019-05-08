import { PlanDetails } from './planDetails';
import { ProductionPlanSummary } from './productionPlanSummary';
import { PhenotypePlanSummary } from './phenotypePlanSummary';

export class PlanInformation {
    planDetails: PlanDetails;
    productionPlanSummary: ProductionPlanSummary = new ProductionPlanSummary();
    phenotypePlanSummary: PhenotypePlanSummary = new PhenotypePlanSummary();
}