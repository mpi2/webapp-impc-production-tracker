import { Injectable } from '@angular/core';
import { Adapter } from 'src/app/core/model/adapter';
import { ProjectDetails } from './project-details';
import { PlanDetails } from 'src/app/plans';

export class Project {
    projectDetails: ProjectDetails = new ProjectDetails();
}

@Injectable({
    providedIn: 'root'
})

export class ProjectAdapter implements Adapter<Project> {

    adapt(item: any): Project {
        console.log('ITEM ProjectAdapter',item);
        
        const project: Project = new Project();
        project.projectDetails = item.projectDetails;

        /*const productionPlans: ProductionPlan[] = [];
        const phenotypePlans: PhenotypePlan[] = [];

        for (const plan of item.plans) {
            const planDetails: PlanDetails = plan.planDetails;
            console.log('plan',plan);

            if (planDetails.planTypeName === 'production') {
                const productionPlan: ProductionPlan = new ProductionPlan();
                productionPlan.planDetails = plan.planDetails;
                productionPlan.attempt = plan.productionPlan.attempt;
                productionPlan.history = history
                productionPlans.push(productionPlan);
                
            } else {
                // Phenotype
                const phenotypePlan: PhenotypePlan = new PhenotypePlan();
                phenotypePlan.planDetails = plan.planDetails;
                if (plan.phenotypePlan) {
                    phenotypePlan.planDetails.productionPlanReference = plan.phenotypePlan.productionPlanReference;
                    phenotypePlan.productionPlanReference = plan.phenotypePlan.productionPlanReference;
                    phenotypePlan.phenotypingProduction = plan.phenotypePlan.phenotypingProduction;
                }
            
                phenotypePlan.history = history
                phenotypePlans.push(phenotypePlan);
            }
        }*/


        return project;
    }

}
