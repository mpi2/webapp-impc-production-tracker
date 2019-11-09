import { AlleleCategorization } from './allele-categorization';
import { IntentionByGene } from './intention-by-gene';
import { IntentionByLocation } from './intention-by-location';
import { IntentionBySequence } from './intention-by-sequence';

export class ProjectIntention {
    alleleTypeName: string;
    molecularMutationTypeName: any;
    alleleCategorizations: AlleleCategorization[];
    intentionTypeName: string;
    intentionByGene: IntentionByGene;
    intentionByLocation: IntentionByLocation;
    intentionBySequence: IntentionBySequence;
}
