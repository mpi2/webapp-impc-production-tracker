import { CrisprAttempt, CrisprAttemptAdapter } from '../../attempts';
import { Injectable } from '@angular/core';
import { Adapter } from 'src/app/core/model/adapter';
import { PhenotypingAttempt } from '../../attempts/model/phenotyping/phenotyping_attempt';
import { StatusDate } from 'src/app/model/bio/status-date';

export class Plan {
    id: number;
    pin: string;
    projectId: number;
    tpn: string;
    funderName: string;
    workUnitName: string;
    isActive: boolean;
    statusName: string;
    statusDates: StatusDate[];
    typeName: string;
    parentColonyName: string;
    comment: string;
    productsAvailableForGeneralPublic: boolean;
    crisprAttemptAttributes: CrisprAttempt;
    phenotypingAttemptAttributes: PhenotypingAttempt;
    productionPlanReference: string;
}

@Injectable({
    providedIn: 'root'
})
export class PlanAdapter implements Adapter<Plan> {
    constructor(
        private crisprAttemptAdapter: CrisprAttemptAdapter) { }

    adapt(item): Plan {
        const plan = item as Plan;
        plan.comment = this.getEmptyIfNull(plan.comment);
        plan.productsAvailableForGeneralPublic = this.getFalseIfNull(plan.productsAvailableForGeneralPublic);
        if (plan.crisprAttemptAttributes) {
            plan.crisprAttemptAttributes = this.crisprAttemptAdapter.adapt(plan.crisprAttemptAttributes);
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
