import { PlanDetails } from './planDetails';
import { ProductionPlanSummary } from './production_plan/productionPlanSummary';
import { PhenotypePlanSummary } from './phenotype_plan/phenotypePlanSummary';

export class PlanInformation {
    planDetails: PlanDetails;
    productionPlanSummary: ProductionPlanSummary = new ProductionPlanSummary();
    phenotypePlanSummary: PhenotypePlanSummary = new PhenotypePlanSummary();
}