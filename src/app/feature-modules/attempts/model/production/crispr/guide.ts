export class Guide {
    id: number;
    sequence: string;
    guideSequence: string;
    pam: string;
    chr: number;
    start: number;
    end: number;
    strand: string;
    genomeBuild: string;
    ensemblExonId: string;
    grnaConcentration: number;
    truncatedGuide: boolean;
    reverse: boolean;
}
