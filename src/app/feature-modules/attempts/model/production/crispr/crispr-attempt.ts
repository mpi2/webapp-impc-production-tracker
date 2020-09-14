import { Nuclease, Guide, Donor, Reagent, GenotypePrimer, Assay, StrainInjected, MutagenesisStrategy } from '../../..';
import { Adapter } from 'src/app/core/model/adapter';
import { Injectable } from '@angular/core';
import { InputHandlerService } from 'src/app/core/services/input-handler.service';

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

    constructor(private inputHandlerService: InputHandlerService) {

    }
    adapt(item: any): CrisprAttempt {
        const crisprAttempt = item as CrisprAttempt;
        crisprAttempt.miDate = this.inputHandlerService.getUTCFormat(crisprAttempt.miDate);
        crisprAttempt.comment = this.inputHandlerService.getEmptyIfNull(crisprAttempt.comment);
        crisprAttempt.attemptExternalRef = this.inputHandlerService.getEmptyIfNull(crisprAttempt.attemptExternalRef);
        crisprAttempt.experimental = this.inputHandlerService.getFalseIfNull(crisprAttempt.experimental);
        return crisprAttempt;
    }
}
