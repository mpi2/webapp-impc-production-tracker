import { Gene } from 'src/app/core';

export class Mutation {
    min: string;
    mgiAlleleId: string;
    imitsAllele: number;
    mgiAlleleSymbol: string;
    mgiAlleleSymbolWithoutImpcAbbreviation: boolean;
    mgiAlleleSymbolRequiresConstruction: boolean;
    geneticMutationTypeName: string;
    molecularMutationTypeName: string;
    mutationQcResults: any[];
    mutationSequences: any[];
    mutationCategorizations: any[];
    genes: Gene[];
}
