export interface MaterialTypeAttribute {
    id: number;
    name: string;
}

export interface TissueDistributionCentreAttribute {
    id: number;
    phenotype_attempt_plan_id: number;
    start_date: string;
    end_date: string;
    work_unit_name: string;
    material_type_attributes: MaterialTypeAttribute[];
}

export interface PhenotypingAttempt {
    plan_id: number;
    imits_phenotype_attempt_id: number;
    imits_phenotyping_production_id: number;
    phenotyping_experiments_started: string;
    phenotyping_started: boolean;
    phenotyping_complete: boolean;
    do_not_count_towards_completeness: boolean;
    tissue_distribution_centre_attributes: TissueDistributionCentreAttribute[];
}
