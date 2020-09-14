// import { CrisprAttempt, CrisprAttemptAdapter } from '../../attempts';
import { Injectable } from '@angular/core';
import { Adapter } from 'src/app/core/model/adapter';
import { PhenotypingAttempt } from '../../attempts/model/phenotyping/phenotyping_attempt';
import { StatusDate } from 'src/app/model/bio/status-date';
import { StatusTransition } from 'src/app/model/status_transition/status_transition';
import { PhenotypingStartingPoint } from '../../attempts/model/phenotyping/phenotyping_starting_point';
import { CrisprAttempt, CrisprAttemptAdapter } from '../../attempts/model/production/crispr/crispr-attempt';

export class Plan {
    id: number;
    pin: string;
    projectId: number;
    tpn: string;
    funderNames: string[];
    workUnitName: string;
    workGroupName: string;
    isActive: boolean;
    statusName: string;
    summaryStatusName: string;
    statusDates: StatusDate[];
    typeName: string;
    attemptTypeName: string;
    parentColonyName: string;
    comment: string;
    productsAvailableForGeneralPublic: boolean;
    crisprAttempt: CrisprAttempt;
    phenotypingAttemptResponse: PhenotypingAttempt;
    // Need to keep this copu because phenotypingAttemptResponse is not processed by the update/create endpoint
    phenotypingAttempt: PhenotypingAttempt;
    statusTransition: StatusTransition;
    // Applies only to phenotyping plans
    phenotypingStartingPoint: PhenotypingStartingPoint;
    // tslint:disable-next-line
    _links: any;
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
        if (plan.crisprAttempt) {
            plan.crisprAttempt = this.crisprAttemptAdapter.adapt(plan.crisprAttempt);
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
