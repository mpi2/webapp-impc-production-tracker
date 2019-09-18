import { StatusDate } from '../../projects';
import { CrisprAttempt, CrisprAttemptAdapter } from '../../attempts';
import { Injectable } from '@angular/core';
import { Adapter } from 'src/app/core/model/adapter';

export class Plan {
    id: number;
    pin: string;
    project_id: number;
    tpn: string;
    funder_name: string;
    work_unit_name: string;
    is_active: boolean;
    status_name: string;
    status_dates: StatusDate[];
    type_name: string;
    parent_colony_name: string;
    comment: string;
    products_available_for_general_public: boolean;
    crispr_attempt_attributes: CrisprAttempt;
    phenotyping_attempt_attributes: any; //TODO: Create class
    production_plan_reference: string;
}

@Injectable({
    providedIn: 'root'
})
export class PlanAdapter implements Adapter<Plan> {
    constructor(
        private crisprAttemptAdapter: CrisprAttemptAdapter) { }

    adapt(item: any): Plan {
        const plan = item as Plan;
        plan.comment = this.getEmptyIfNull(plan.comment);
        plan.products_available_for_general_public = this.getFalseIfNull(plan.products_available_for_general_public);
        if (plan.crispr_attempt_attributes) {
            plan.crispr_attempt_attributes = this.crisprAttemptAdapter.adapt(plan.crispr_attempt_attributes);
        }
        return plan;
    }

    private getEmptyIfNull(value: string): string {
        return value === null ? '' : value;
    }

    private getFalseIfNull(value: boolean): boolean {
        return value === null ? false : value;
    }
}