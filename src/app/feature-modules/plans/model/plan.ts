// import { CrisprAttempt, CrisprAttemptAdapter } from '../../attempts';
import { Injectable } from '@angular/core';
import { Adapter } from 'src/app/core/model/adapter';
import { PhenotypingAttempt } from '../../attempts/model/phenotyping/phenotyping_attempt';
import { StatusDate } from 'src/app/model/bio/status-date';
import { StatusTransition } from 'src/app/model/status_transition/status_transition';
import { PhenotypingStartingPoint } from '../../attempts/model/phenotyping/phenotyping_starting_point';
import { CrisprAttempt, CrisprAttemptAdapter } from '../../attempts/model/production/crispr/crispr-attempt';
import { InputHandlerService } from 'src/app/core/services/input-handler.service';

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
    crisprAttempt: CrisprAttempt;
    phenotypingAttemptResponse: PhenotypingAttempt;
    // Need to keep this copy because phenotypingAttemptResponse is not processed by the update/create endpoint
    phenotypingAttempt: PhenotypingAttempt;
    statusTransition: StatusTransition;
    // Applies only to phenotyping plans
    phenotypingStartingPoint: PhenotypingStartingPoint;
    // eslint-disable-next-line
    _links: any;
}

@Injectable({
    providedIn: 'root'
})
export class PlanAdapter implements Adapter<Plan> {
    constructor(
        private crisprAttemptAdapter: CrisprAttemptAdapter, private inputHandlerService: InputHandlerService) { }

    adapt(item): Plan {
        const plan = item as Plan;
        plan.comment = this.inputHandlerService.getEmptyIfNull(plan.comment);
        if (plan.crisprAttempt) {
            plan.crisprAttempt = this.crisprAttemptAdapter.adapt(plan.crisprAttempt);
        }
        if (plan.attemptTypeName === 'crispr' || plan.attemptTypeName === 'haplo-essential crispr') {
            if (!plan.crisprAttempt) {
                plan.crisprAttempt = new CrisprAttempt();
            }
        }
        return plan;
    }
}
