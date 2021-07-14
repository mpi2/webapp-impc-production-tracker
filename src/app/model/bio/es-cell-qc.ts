export class EsCellQc {
    id: number;
    numberOfEsCellsReceived: number;
    esCellsReceivedFromName: string;
    esCellsReceivedOn: Date;
    numberOfEsCellsStartingQc: number;
    numberOfEsCellsPassingQc: number;
    esCellQcComment: string;

    completionComment: string;
    completionNote: string;
}
