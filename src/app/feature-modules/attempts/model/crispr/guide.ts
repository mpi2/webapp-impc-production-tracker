export class Guide {
    id: number;
    crispr_attempt_plan_id: number;
    chr: number;
    end: number;
    grna_concentration: number;
    sequence: string;
    start: number;
    truncated_guide: boolean;
    strand: string;
    genome_build: string;
    pam3: string;
    pam5: string;
    protospacer_sequence: string;
}
