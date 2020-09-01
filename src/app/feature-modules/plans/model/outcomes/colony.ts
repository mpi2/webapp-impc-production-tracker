import { StatusDate } from 'src/app/model';
import { DistributionProduct } from './distribution-product';
import { StatusTransition } from 'src/app/model/status_transition/status_transition';

export class Colony {
    name: string;
    genotypingComment: string;
    outcomeTypeName: string;
    statusName: string;
    statusDates: StatusDate[];
    backgroundStrainName: string;
    distributionProducts: DistributionProduct[] = [];
    statusTransition: StatusTransition;
}
