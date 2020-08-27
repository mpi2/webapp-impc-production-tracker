/**
 * Keeps data that is usually static and used in several places in the application.
 */
export class ConfigurationData {
    planTypes: string[];
    priorities: string[];
    privacies: string[];
    statuses: string[];
    assignmentStatuses: string[];
    workGroups: string[];
    workUnits: string[];
    alleleTypes: string[];
    institutes: string[];
    roles: string[];
    trackedStrains: string[];
    backgroundStrains: string[];
    materialTypes: string[];
    preparationTypes: string[];
    searchTypes: string[];
    species: string[];
    consortia: string[];
    molecularMutationTypes: string[];
    mutationCategorizations: string[];
    mutationCategorizationsByType: Map<string, any[]>;
    sequenceTypes: string[];
    sequenceCategorizations: string[];
    funders: string[];
    attemptTypes: string[];
    nucleaseTypes: string[];
    nucleaseClasses: string[];
    productTypes: string[];
    distributionNetworks: string[];
    consortiaToConstructSymbols: string[];
    qcTypes: string[];
    qcStatuses: string[];
}
