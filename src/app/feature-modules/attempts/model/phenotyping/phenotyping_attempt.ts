import { PhenotypingStartingPoint } from './phenotyping_starting_point';

export class TissueDistributionCentre {
    id: number;
    startDate: string;
    endDate: string;
    workUnitName: string;
    materialDepositedTypeName: string;
}

export interface PhenotypingLinks {
    phenotypingStages: any[];
}

export class PhenotypingAttempt {
    phenotypingExternalRef: string;
    phenotypingBackgroundStrainName: string;
    phenotypingStartingPoint?: PhenotypingStartingPoint;
    // tslint:disable-next-line
    _links?: PhenotypingLinks;

}
