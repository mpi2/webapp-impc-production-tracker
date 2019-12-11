import { Gene } from './gene';
import { Ortholog } from './ortholog';

export class IntentionByGene {
    gene: Gene;
    allOrthologs: Ortholog[];
    bestOrthologs: Ortholog[];
}
