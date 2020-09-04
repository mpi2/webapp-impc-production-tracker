import { TissueDistributionCentre } from './phenotyping_attempt';
import { StatusDate } from 'src/app/model';
import { StatusTransition } from 'src/app/model/status_transition/status_transition';

export class PhenotypingStage {
    pin: string;
    psn: string;
    statusName: string;
    phenotypingTypeName: string;
    phenotypingExternalRef: string;
    phenotypingExperimentsStarted: Date;
    doNotCountTowardsCompleteness: boolean;
    initialDataReleaseDate: Date;
    tissueDistributions: TissueDistributionCentre[];
    statusDates: StatusDate[];
    statusTransition: StatusTransition;
}
