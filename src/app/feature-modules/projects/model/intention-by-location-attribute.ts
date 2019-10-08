import { StrainAttribute } from './strain-attribute';

export class IntentionByLocationAttribute {
    alleleTypeName: string;
    chr: string;
    start: number;
    end: number;
    strand: string;
    genomeBuild: string;
    strainAttributes: StrainAttribute[];
    specieName: string;
    sequenceType: string;
    chrFeatureTypeId: number;
}
