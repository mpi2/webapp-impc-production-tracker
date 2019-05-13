export class ProjectDetails {
    tpn: string;
    assigmentStatusName: string;
    priorityName: string;
    locations: string;
    alleleIntentions: string[];
    markerSymbols: { [id: string] : string; } = {};
}
