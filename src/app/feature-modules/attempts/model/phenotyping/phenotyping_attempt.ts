import { PhenotypingStartingPoint } from './phenotyping_starting_point';

export interface TissueDistributionCentre {
    id: number;
    plan_id: number;
    startDate: string;
    endDate: string;
    workUnitName: string;
    materialTypeName: string;
}

export interface PhenotypingLinks {
    phenotypingStages: any[];
}

export interface PhenotypingAttempt {
    phenotypingExternalRef: string;
    phenotypingBackgroundStrainName: string;
    phenotypingStartingPoint: PhenotypingStartingPoint;
    // tslint:disable-next-line
    _links: PhenotypingLinks;

}
