import { Colony } from './colony';
import { Specimen } from './specimen';
import { Mutation } from './mutation';

export class Outcome {
    tpo: string;
    pin: string;
    tpn: string;
    outcomeTypeName: string;
    colony: Colony;
    specimen: Specimen;
    mutations: Mutation[];
}
