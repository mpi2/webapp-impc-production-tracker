import { Strain } from 'src/app/core/model/bio/strain';

export class Location {
    chr: string;
	start: number;
	stop: number;
	strand: string;
	genomeBuild: string;
	strain: Strain;
}
