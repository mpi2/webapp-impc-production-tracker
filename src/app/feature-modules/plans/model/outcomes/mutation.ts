import { Gene } from 'src/app/core';

export class Mutation {
    min: string;
    pin: string;
    mgiAlleleId: string;
    imitsAllele: number;
    symbol: string;
    mgiAlleleSymbolWithoutImpcAbbreviation: boolean;
    mgiAlleleSymbolRequiresConstruction: boolean;
    geneticMutationTypeName: string;
    molecularMutationTypeName: string;
    mutationQcResults: any[];
    mutationSequences: any[];
    mutationCategorizations: any[];
    genes: Gene[];
    geneSymbolsOrAccessionIds: string[];
    calculatedMgiAlleleSymbol: string;
    symbolSuggestionRequest: any;
}
