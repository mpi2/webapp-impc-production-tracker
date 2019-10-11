import { Gene } from '../../genes/model/gene';

export class IntentionByGene {
    alleleTypeName: string;
    molecularMutationTypeName: string;
    alleleCategorizations: string[];
    gene: Gene;
}
