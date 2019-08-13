import { Nuclease, Guide, Donor, Reagent, GenotypePrimer, Assay, StrainInjected } from '../..';

export class CrisprAttempt {
    plan_id: number;
    imits_mi_attempt_id: number;
    attempt_type_name: string;
    mi_date: Date;
    attempt_external_ref: string;
    experimental: boolean;
    comments: string;
    mutagenesis_external_ref: string;
    delivery_type_method_name: string;
    voltage: number;
    number_of_pulses: number;
    total_embryos_injected: number;
    total_embryos_survived: number;
    embryo_transfer_day: string;
    embryo_2_cell: string;
    total_transfered: number;
    no_founder_pups: number;
    nuclease_attributes: Nuclease[] = [];
    guides_attributes: Guide[] = [];
    donors_attributes: Donor[] = [];
    reagents_attributes: Reagent[] = [];
    genotype_primers_attributes: GenotypePrimer[] = [];
    assay_attributes: Assay[] = [];
    strain_injected_attributes: StrainInjected[] = [];
}

