import { Strain } from '../../../core/model/bio/strain';

export class IntentionByLocation {
    alleleTypeName: string;
    chr: string;
    start: number;
    end: number;
    strand: string;
    genomeBuild: string;
    strainAttributes: Strain[];
    specieName: string;
    sequenceType: string;
    chrFeatureTypeId: number;


    chrFeatureTypeName: string;
    molecularMutationTypeName: string;
    alleleCategorizations: string[];
    location: Location;
}
