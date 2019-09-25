export interface TissueDistributionCentre {
    id: number;
    plan_id: number;
    startDate: string;
    endDate: string;
    workUnitName: string;
    materialTypeName: string;
}

export interface PhenotypingAttempt {
    planId: number;
    imitsPhenotypeAttemptId: number;
    imitsPhenotypingProductionId: number;
    phenotypingExperimentsStarted: string;
    phenotypingStarted: boolean;
    phenotypingComplete: boolean;
    doNotCountTowardsCompleteness: boolean;
    tissueDistributionCentreAttributes: TissueDistributionCentre[];
}
