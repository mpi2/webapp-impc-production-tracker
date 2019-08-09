export class CrisprAttempt {
    miDate: Date;
    miExternalRef: string;
    mutagenesisExternalRef: string;
    individuallySetGrnaConcentrations: boolean;
    guidesGeneratedInPlasmid: boolean;
    gRnaConcentration: number;
    noG0WhereMutationDetected: number;
    noNhejG0Mutants: number;
    noDeletionG0Mutants: number;
    noHrG0Mutants: number;
    noHdrG0Mutants: number;
    noHdrG0MutantsAllDonorsInserted: number;
    noHdrG0MutantsSubsetDonorsInserted: number;
    totalEmbryosInjected: number;
    totalEmbryosSurvived: number;
    totalTransferred: number;
    noFounderPups: number;
    noFounderSelectedForBreeding: number;
    founderNumAssays: number;
    assayType: string;
    experimental: boolean;
    mbryoTransferDay: string;
    embryo2Cell: string;
    deliveryMethod: string;
    voltage: number;
    numberOfPulses: number;
    embryoSurvived2CellnumberOfPulses: number;
    comment: string;
    nucleases: [] = [];
    reagents: [] = [];
    primers: [] = [];
    mutagenesisDonors: [] = [];
    guides: [] = [];
}

