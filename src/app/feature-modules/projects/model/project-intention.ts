import { IntentionByGene } from '../../../model/bio/intention-by-gene';
import { IntentionBySequence } from '../../../model/bio/intention-by-sequence';
import { MutationCategorization } from '../../../model/bio/mutation-categorization';

export class ProjectIntention {
    id: string;
    molecularMutationTypeName: string;
    mutationCategorizations: MutationCategorization[];
    intentionByGene: IntentionByGene;
    intentionsBySequence: IntentionBySequence[];
}
