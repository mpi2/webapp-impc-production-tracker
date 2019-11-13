import { IntentionByGene } from './intention-by-gene';
import { IntentionBySequence } from './intention-by-sequence';

export class ProjectIntention {
    molecularMutationTypeName: any;
    alleleTypeName: string;
    intentionTypeName: string;

    intentionByGene: IntentionByGene;
    intentionBySequence: IntentionBySequence;
}
