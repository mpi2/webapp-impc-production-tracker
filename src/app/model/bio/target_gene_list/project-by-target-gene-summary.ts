export class ProjectByTargetGeneSummary {
    tpn: string;
    assignmentStatusName: string;
    plans: PlanSummary[];
}

export class PlanSummary {
    pin: string;
    statusName: string;
    workUnitName: string;
    outcomes: OutcomeSummary[];
}

export class OutcomeSummary {
    statusName: string;
    molecularMutationTypeName: string;
}
