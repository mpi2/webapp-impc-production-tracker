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
        const project: Project = new Project();
        project.projectDetails = item.projectDetails;

        const productionPlans: ProductionPlan[] = [];
        const phenotypePlans: PhenotypePlan[] = [];

        for (const plan of item.plans) {
            const planDetails: PlanDetails = plan.planDetails;
            if (planDetails.planTypeName === 'production') {
                const productionPlan: ProductionPlan = new ProductionPlan();
                productionPlan.planDetails = plan.planDetails;
                productionPlan.attempt = plan.productionPlan.attempt;
                productionPlans.push(productionPlan);
            } else {
                // Phenotype
                const phenotypePlan: PhenotypePlan = new PhenotypePlan();
                phenotypePlan.planDetails = plan.planDetails;
                phenotypePlan.additionalData = plan.phenotypePlan;
                phenotypePlans.push(phenotypePlan);
            }
        }
        project.productionPlans = productionPlans;
        project.phenotypePlans = phenotypePlans;

        return project;
    }

}
