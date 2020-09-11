import { Nuclease, Guide, Donor, Reagent, GenotypePrimer, Assay, StrainInjected, MutagenesisStrategy } from '../../..';
import { Adapter } from 'src/app/core/model/adapter';
import { Injectable } from '@angular/core';

export class CrisprAttempt {
    planId: number;
    imitsMiAttemptId: number;
    attemptTypeName: string;
    miDate: Date;
    attemptExternalRef: string;
    experimental: boolean;
    comment: string;
    mutagenesisExternalRef: string;
    deliveryTypeMethodName: string; // to be deleted
    voltage: number; // to be deleted
    numberOfPulses: number; // to be deleted
    totalEmbryosInjected: number;
    totalEmbryosSurvived: number;
    embryoTransferDay: string;
    embryo2Cell: string;
    totalTransfered: number;
    noFounderPups: number;
    nucleases: Nuclease[] = [];
    guides: Guide[] = [];
    mutagenesisDonors: Donor[] = [];
    mutagenesisStrategies: MutagenesisStrategy[];
    reagents: Reagent[] = [];
    genotypePrimers: GenotypePrimer[] = [];
    assay: Assay = new Assay();
    strainInjected: StrainInjected[] = [];
}

@Injectable({
    providedIn: 'root'
})
export class CrisprAttemptAdapter implements Adapter<CrisprAttempt> {
    adapt(item: any): CrisprAttempt {
        const crisprAttempt = item as CrisprAttempt;
        crisprAttempt.miDate = this.getUTCFormat(crisprAttempt.miDate);
        crisprAttempt.comment = this.getEmptyIfNull(crisprAttempt.comment);
        crisprAttempt.attemptExternalRef = this.getEmptyIfNull(crisprAttempt.attemptExternalRef);
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

