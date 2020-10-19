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
    workGroupsByWorkUnits: Map<string, any[]>;
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
    outcomeTypes: string[];
    sequenceTypes: string[];
    sequenceCategorizations: string[];
    funders: string[];
    fundersByWorkGroups: Map<string, any[]>;
    attemptTypes: string[];
    attemptTypesByPlanTypes: Map<string, any[]>;
    nucleaseTypes: string[];
    nucleaseClasses: string[];
    productTypes: string[];
    distributionNetworks: string[];
    consortiaToConstructSymbols: string[];
    qcTypes: string[];
    qcStatuses: string[];
    reagents: string[];
    assayTypes: string[];
    phenotypingStagesTypes: string[];
    phenotypingStagesTypesByAttemptTypes: Map<string, any[]>;
    recordTypesByConsortium: Map<string, any[]>;
}
