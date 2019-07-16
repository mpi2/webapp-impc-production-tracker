import { PlanDetails } from './plan-details';
import { ProductionPlan } from './production-plan';
import { Injectable } from '@angular/core';
import { Adapter } from 'src/app/core/model/adapter';
import { ChangesHistory, ChangesHistoryAdapter } from 'src/app/core/model/history/changes-history';
import { ProjectDetails } from '../../projects/model/project-details';

export class Plan {
    projectDetails = new ProjectDetails();
    planDetails = new PlanDetails();
    changesHistory = new ChangesHistory();
    productionPlan = new ProductionPlan();
}

@Injectable({
    providedIn: 'root'
})
export class PlanAdapter implements Adapter<Plan> {

    adapt(item: any): Plan {
        console.log('{item}', item);

        const plan = new Plan();

        const historyAdapter = new ChangesHistoryAdapter();

        const projectDetails = item.projectDetails;
        const planDetails = item.planInformation.planDetails;
        //const changesHistory = item.planInformation.history.map(x => x = historyAdapter.adapt(x));
        let productionPlan = new ProductionPlan();

        if (planDetails.planTypeName === 'production') {
            const element = item.planInformation.productionPlan;
            if (element) {
                productionPlan.attemptType = element.attempt.attemptType;
                productionPlan.crisprAttempt = element.attempt.crisprAttempt;
            }

        } else if (item.projectDetails.planTypeName === 'phenotyping') {
            ///
        }

        plan.planDetails = planDetails;
        plan.projectDetails = projectDetails;
        //plan.changesHistory = changesHistory;
        plan.productionPlan = productionPlan;

        return plan;
    }

}