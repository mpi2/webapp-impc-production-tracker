import { Colony } from './colony';
import { Specimen } from './specimen';

export class Outcome {
    tpo: string;
    pin: string;
    tpn: string;
    outcomeTypeName: string;
    colony: Colony;
    specimen: Specimen;
}
