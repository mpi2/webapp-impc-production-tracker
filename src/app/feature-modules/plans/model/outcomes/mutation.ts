import { Gene } from 'src/app/core';
import { QcResult } from './qc_result';

export class Mutation {
    min: string;
    pin: string;
    tpo: string;
    mgiAlleleId: string;
    imitsAllele: number;
    symbol: string;
    mgiAlleleSymbolWithoutImpcAbbreviation: boolean;
    mgiAlleleSymbolRequiresConstruction: boolean;
    geneticMutationTypeName: string;
    molecularMutationTypeName: string;
    mutationQcResults: QcResult[] = [];
    mutationSequences: any[] = [];
    mutationCategorizations: any[] = [];
    genes: Gene[] = [];
    geneSymbolsOrAccessionIds: string[] = [];
    calculatedMgiAlleleSymbol: string;
    symbolSuggestionRequest: any;
}
