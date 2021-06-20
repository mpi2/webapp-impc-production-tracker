import { Adapter } from 'src/app/core/model/adapter';
import { Injectable } from '@angular/core';
import { InputHandlerService } from 'src/app/core/services/input-handler.service';

export class EsCellAttempt {
    planId: number;
    imitsMiAttemptId: number;
    attemptTypeName: string;
    esCellName: string;
    miDate: Date;
    attemptExternalRef: string;
    experimental: boolean;
    comment: string;
    blastStrainName: string;
    totalBlastsInjected: number;
    totalTransferred: number;
    numberSurrogatesReceiving: number;
    totalPupsBorn: number;
    totalFemaleChimeras: number;
    totalMaleChimeras: number;
    totalChimeras: number;
    numberOfMalesWith0To39PercentChimerism: number;
    numberOfMalesWith40To79PercentChimerism: number;
    numberOfMalesWith80To99PercentChimerism: number;
    numberOfMalesWith100PercentChimerism: number;
    testCrossStrainName: string;
    dateChimerasMated: Date;
    numberOfChimeraMatingsAttempted: number;
    numberOfChimeraMatingsSuccessful: number;
    numberOfChimerasWithGltFromCct: number;
    numberOfChimerasWithGltFromGenotyping: number;
    numberOfChimerasWith0To9PercentGlt: number;
    numberOfChimerasWith10To49PercentGlt: number;
    numberOfChimerasWith50To99PercentGlt: number;
    numberOfChimerasWith100PercentGlt: number;
    totalF1MiceFromMatings: number;
    numberOfCctOffspring: number;
    cassetteTransmissionVerified: Date;
    cassetteTransmissionVerifiedAutoComplete: boolean;
    numberOfHetOffspring: number;
    numberOfLiveGltOffspring: number;
}

@Injectable({
    providedIn: 'root'
})
export class EsCellAttemptAdapter implements Adapter<EsCellAttempt> {

    constructor(private inputHandlerService: InputHandlerService) {

    }
    adapt(item: any): EsCellAttempt {
        const esCellAttempt = item as EsCellAttempt;
        esCellAttempt.miDate = this.inputHandlerService.getUTCFormat(esCellAttempt.miDate);
        esCellAttempt.comment = this.inputHandlerService.getEmptyIfNull(esCellAttempt.comment);
        esCellAttempt.attemptExternalRef = this.inputHandlerService.getEmptyIfNull(esCellAttempt.attemptExternalRef);
        return esCellAttempt;
    }

}
