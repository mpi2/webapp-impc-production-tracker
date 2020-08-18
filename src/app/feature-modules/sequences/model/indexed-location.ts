import { Strain } from 'src/app/model/bio/strain';

export class IndexedLocation {
    index: number;
    chr: string;
    start: number;
    stop: number;
    strand: string;
    genomeBuild: string;
    strain: Strain;
}
