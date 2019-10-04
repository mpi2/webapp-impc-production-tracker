export class Assay {
    id: string;
    crispr_attempt_plan_id: number;
    type_name: string;
    founder_num_assays: number;
    num_deletion_g0_mutants: number;
    num_g0_where_mutation_detected: number;
    num_hdr_g0_mutants: any;
    num_hdr_g0_mutants_all_donors_inserted: number;
    num_hdr_g0_mutants_subset_donors_inserted: number;
    num_hr_g0_mutants: number;
    num_nhej_g0_mutants: number;
    num_founders_selected_for_breeding: number;
}