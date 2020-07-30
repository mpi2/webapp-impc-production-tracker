import { StatusDate } from 'src/app/model';
import { StatusTransition } from 'src/app/model/status_transition/status_transition';

export class Specimen {
    specimenExternalRef: string;
    specimenTypeName: string;
    statusName: string;
    statusDates: StatusDate[];
    backgroundStrainName: string;
    statusTransition: StatusTransition;
}
