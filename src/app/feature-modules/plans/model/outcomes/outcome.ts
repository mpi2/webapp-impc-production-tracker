import { Colony } from './colony';
import { Specimen } from './specimen';

export class Outcome {
    tpo: string;
    pin: string;
    outcomeTypeName: string;
    colony: Colony;
    specimen: Specimen;
}
