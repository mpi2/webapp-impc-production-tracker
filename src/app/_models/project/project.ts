import { Injectable } from '@angular/core';
import { Adapter } from 'src/app/_core/adapter';
import { ProjectDetails } from './projectDetails';
import { PlanDetails } from './planDetails';
import { ProductionPlan } from './production_plan/productionPlan';
import { PhenotypePlan } from './phenotype_plan/phenotypePlan';

export class Project {
    projectDetails: ProjectDetails = new ProjectDetails();
    productionPlans: ProductionPlan[] = [];
    phenotypePlans: PhenotypePlan[] = [];
}

@Injectable({
    providedIn: 'root'
})
export class ProjectAdapter implements Adapter<Project> {
    adapt(item: any): Project {        
        let project: Project = new Project();
        project.projectDetails = item.projectDetails;

        let productionPlans: ProductionPlan[] = [];
        let phenotypePlans: PhenotypePlan[] = [];
       
        for (let plan of item.plans) {
            let planDetails: PlanDetails = plan.planDetails;
            if (planDetails.planTypeName === 'production') {
                let productionPlan: ProductionPlan = new ProductionPlan();
                productionPlan.planDetails = plan.planDetails;
                productionPlan.attempt = plan.productionPlan.attempt;
                productionPlans.push(productionPlan);
            }
            else
            {
                // Phenotype
                let phenotypePlan: PhenotypePlan = new PhenotypePlan;
                phenotypePlan.planDetails = plan.planDetails;
                phenotypePlan.phenotypePlanSummary = plan.phenotypePlanSummary;
                phenotypePlans.push(phenotypePlan)
            }
        }
        project.productionPlans = productionPlans;
        project.phenotypePlans = phenotypePlans;

        return project;
    }

}
