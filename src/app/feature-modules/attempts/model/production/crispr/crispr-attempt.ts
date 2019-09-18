import { Nuclease, Guide, Donor, Reagent, GenotypePrimer, Assay, StrainInjected } from '../../..';
import { Adapter } from 'src/app/core/model/adapter';
import { Injectable } from '@angular/core';

export class CrisprAttempt {
    plan_id: number;
    imits_mi_attempt_id: number;
    attempt_type_name: string;
    mi_date: Date;
    attempt_external_ref: string;
    experimental: boolean;
    comment: string;
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

@Injectable({
    providedIn: 'root'
})
export class CrisprAttemptAdapter implements Adapter<CrisprAttempt> {
    adapt(item: any): CrisprAttempt {
        const crisprAttempt = item as CrisprAttempt;
        crisprAttempt.mi_date = this.getUTCFormat(crisprAttempt.mi_date);
        crisprAttempt.comment = this.getEmptyIfNull(crisprAttempt.comment);
        crisprAttempt.attempt_external_ref = this.getEmptyIfNull(crisprAttempt.attempt_external_ref);
        crisprAttempt.experimental = this.getFalseIfNull(crisprAttempt.experimental);
        return crisprAttempt;
    }

    private getEmptyIfNull(value: string): string {
        return value === null ? '' : value;
    }

    private getFalseIfNull(value: boolean): boolean {
        return value === null ? false : value;
    }

    private getUTCFormat(originalData: Date): Date {
        return new Date(originalData.toString() + 'T00:00:00Z');
    }
}

