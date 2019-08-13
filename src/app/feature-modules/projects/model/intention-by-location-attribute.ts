import { StrainAttribute } from './strain-attribute';

export class IntentionByLocationAttribute {
    allele_type_name: string;
    chr: string;
    start: number;
    end: number;
    strand: string;
    genome_build: string;
    strain_attributes: StrainAttribute[];
    specie_name: string;
    sequence_type: string;
    chr_feature_type_id: number;
}