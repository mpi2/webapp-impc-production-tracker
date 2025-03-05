import {Gene} from 'src/app/core';
import {QcResult} from './qc_result';

export class Mutation {
  id: number;
  min: string;
  pin: string;
  tpo: string;
  mgiAlleleId: string;
  imitsAlleleId: number;
  symbol: string;
  mgiAlleleSymbolWithoutImpcAbbreviation: boolean;
  mgiAlleleSymbolRequiresConstruction: boolean;
  geneticMutationTypeName: string;
  molecularMutationTypeName: string;
  mutationQcResults: QcResult[] = [];
  mutationSequences: any[] = [];
  molecularMutationDeletions: any[] = [];
  targetedExons: any[] = [];
  mutationCategorizations: any[] = [];
  genes: Gene[] = [];
  calculatedMgiAlleleSymbol: string;
  symbolSuggestionRequest: any;
  description: string;
  qcNote: string;
  isManualMutationDeletion: boolean;
  isMutationDeletionChecked: boolean;
}
