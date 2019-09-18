import { HttpInterceptor, HTTP_INTERCEPTORS, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap, materialize, delay, dematerialize } from 'rxjs/operators';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const authHeader = request.headers.get('Authorization');
        const isLoggedIn = authHeader && authHeader.startsWith('Bearer fake-jwt-token');

        // wrap in delayed observable to simulate server api call
        return of(null).pipe(mergeMap(() => {
            if (request.url.includes('/projectsx/') && !request.url.includes('/history') && request.method === 'GET') {
                // if (!isLoggedIn) { return unauthorised(); }
                return ok(getProject());
            }
            if ((request.url.includes('plans/PIN:0000000002')) && !request.url.includes('/history') && request.method === 'GET') {
                // if (!isLoggedIn) { return unauthorised(); }
                return ok(getPlanWithCrisprAttempt());
            }

            if (request.url.includes('plans/PIN:0000000012') && !request.url.includes('/history') && request.method === 'GET') {
                // if (!isLoggedIn) { return unauthorised(); }
                return ok(getPlanWithPhenotypingAttempt());
            }

            // pass through any requests not handled above
            console.log('No faked');

            return next.handle(request);
        }))
            // call materialize and dematerialize to ensure delay even if an error is thrown 
            // (https://github.com/Reactive-Extensions/RxJS/issues/648)
            .pipe(materialize())
            .pipe(delay(500))
            .pipe(dematerialize());

        // private helper functions

        function ok(body) {
            return of(new HttpResponse({ status: 200, body }));
        }

        function unauthorised() {
            return throwError({ status: 401, error: { message: 'Unauthorised' } });
        }

        function error(message) {
            return throwError({ status: 400, error: { message } });
        }

        function getProject() {
            const projects = [
                {
                    "id": 153,
                    "assignment_status_name": "Assigned",
                    "assignment_status_dates": [
                        {
                            "name": "Assigned",
                            "date": "2015-04-03"
                        }
                    ],
                    "withdrawn": false,
                    "recovery": true,
                    "tpn": "TPN:000000010",
                    "intention_by_gene_attributes": [
                        {
                            "id": "",
                            "mgi_accession_id": "MGI:1918645",
                            "marker_symbol": "",
                            "specie_name": "",
                            "allele_type_name": "null"
                        }
                    ],
                    "intention_by_location_attributes": [
                        {
                            "allele_type_name": "null",
                            "chr": "",
                            "start": "",
                            "end": "",
                            "strand": "",
                            "genome_build": "",
                            "strain_attributes":
                            {
                                "id": "",
                                "name": "C57BL/6N",
                                "mgi_accession": "MGI:2159965",
                                "type": "blast"
                            },
                            "specie_name": "",
                            "sequence_type": "",
                            "chr_feature_type_id": 1
                        }
                    ],
                    "imits_mi_plan_id": null,
                    "comment": "A comment about the project",
                    "is_active": true,
                    "production_plans_count": 1,
                    "phenotype_plans_count": 1,
                    "_links":
                    {
                        "self": {
                            "href": "http://localhost:8080/api/projects/19509"
                        },
                        "production_plans": [
                            {
                                "href": "http://localhost:8080/api/plans/PIN:0000000002"
                            }
                        ],
                        "phenotyping_plans": [
                            {
                                "href": "http://localhost:8080/api/plans/PIN:0000000012"
                            }
                        ]
                    }
                }
            ];

            return projects[0];
        }

        function getPlanWithCrisprAttempt() {
            const plan = [
                {
                    "id": 16420,
                    "pin": "PIN:0000000002",
                    "project_id": 123,
                    "funder_name": "",
                    "consortium_name": "",
                    "work_group_name": "DTCC",
                    "work_unit_name": "UCD",
                    "is_active": true,
                    "status_name": "Production completed",
                    "status_dates": [
                        {
                            "name": "Micro-injection in progress",
                            "date": "2014-12-18"
                        },
                        {
                            "name": "Founder obtained",
                            "date": "2015-01-06"
                        },
                        {
                            "name": "Chimeras/Founder obtained",
                            "date": "2015-01-06"
                        },
                        {
                            "name": "Production complete",
                            "date": "2015-02-16"
                        }
                    ],
                    "type_name": "production",
                    "privacy_name": "public",
                    "parent_colony_name": "",
                    "comment": null,
                    "products_available_for_general_public": true,
                    "attempts_count": 2,
                    "crispr_attempt_attributes":
                    {
                        "plan_id": 18098,
                        "imits_mi_attempt_id": 14903,
                        "attempt_type_name": "mutagenesis_crispr",
                        "mi_date": "2014-12-18",
                        "attempt_external_ref": "Gpr68 Cas9 Low",
                        "experimental": false,
                        "comment": "Cas9: 20 ng/ul;\r\ngRNA1: 2.5 ng/ul;\r\ngRNA2: 2.5 ng/ul.\r\nGPRR\r\n",
                        "mutagenesis_external_ref": "MF-16",
                        "delivery_type_method_name": "Cytoplasmic Injection",
                        "voltage": null,
                        "number_of_pulses": null,
                        "nuclease_attributes":
                            [
                                {
                                    "id": 1,
                                    "crispr_attempt_plan_id": 18098,
                                    "concentration": 20,
                                    "type_name": "CAS9"
                                }
                            ],
                        "guides_attributes":
                            [
                                {
                                    "id": 2296,
                                    "crispr_attempt_plan_id": 18098,
                                    "chr": "10",
                                    "end": 115478571,
                                    "grna_concentration": null,
                                    "sequence": "AGGCCGCTGAAACAGCTGGGTGG",
                                    "start": 115478549,
                                    "truncated_guide": false,
                                    "strand": "",
                                    "genome_build": "",
                                    "pam3": "",
                                    "pam5": "",
                                    "protospacer_sequence": ""
                                }
                            ],
                        "donors_attributes":
                            [
                                {
                                    "id": 22,
                                    "crispr_attempt_plan_id": 18098,
                                    "vector_name": "Afmid-Tm1cshort",
                                    "concentration": "20",
                                    "preparation": "Circular",
                                    "oligo_sequence_fa": ""
                                }
                            ],
                        "reagents_attributes":
                            [
                                {
                                    "id": "",
                                    "crispr_attempt_plan_id": 18098,
                                    "name": "",
                                    "concentration": "",
                                    "description": ""
                                }
                            ],
                        "genotype_primers_attributes":
                            [
                                {
                                    "id": 1017,
                                    "crispr_attempt_plan_id": 18098,
                                    "genomic_end_coordinate": 115478165,
                                    "genomic_start_coordinate": 115478146,
                                    "name": "Forward",
                                    "sequence": "GGGGCTTTTTGACCTTTGTA"
                                }
                            ],
                        "total_embryos_injected": 100,
                        "total_embryos_survived": 85,
                        "embryo_transfer_day": "Same Day",
                        "embryo_2_cell": null,
                        "total_transfered": 85,
                        "num_founder_pups": 30,
                        "assay_attributes":
                        {
                            "id": "",
                            "crispr_attempt_plan_id": 18098,
                            "type_name": "PCR",
                            "founder_num_assays": 30,
                            "num_deletion_g0_mutants": 14,
                            "num_g0_where_mutation_detected": 14,
                            "num_hdr_g0_mutants": null,
                            "num_hdr_g0_mutants_all_donors_inserted": null,
                            "num_hdr_g0_mutants_subset_donors_inserted": null,
                            "num_hr_g0_mutants": null,
                            "num_nhej_g0_mutants": null,
                        },
                        "num_founders_selected_for_breeding": 2,
                        "strain_injected_attributes":
                        {
                            "id": "",
                            "name": "C57BL/6N",
                            "mgi_accession": "MGI:2159965",
                            "type": "blast"
                        },
                        "outcomes_count": 3
                    }
                }
            ];

            return plan[0];
        }

        function getPlanWithPhenotypingAttempt() {
            const plan = [
                {
                    "id": 16421,
                    "pin": "PIN:0000000012",
                    "project_id": 123,
                    "funder_name": "",
                    "consortium_name": "",
                    "work_group_name": "DTCC",
                    "work_unit_name": "UCD",
                    "is_active": true,
                    "status_name": "Production completed",
                    "status_dates": [
                        {
                            "name": "Micro-injection in progress",
                            "date": "2014-12-18"
                        },
                        {
                            "name": "Founder obtained",
                            "date": "2015-01-06"
                        },
                        {
                            "name": "Chimeras/Founder obtained",
                            "date": "2015-01-06"
                        },
                        {
                            "name": "Production complete",
                            "date": "2015-02-16"
                        }
                    ],
                    "type_name": "phenotyping",
                    "privacy_name": "public",
                    "parent_colony_name": "",
                    "comment": null,
                    "products_available_for_general_public": true,
                    "attempts_count": 2,
                    "phenotyping_attempt_attributes": {
                        "plan_id": 1,
                        "imits_phenotype_attempt_id": 1,
                        "imits_phenotyping_production_id": 1,
                        "phenotyping_experiments_started": "2015-02-16",
                        "phenotyping_started": true,
                        "phenotyping_complete": true,
                        "do_not_count_towards_completeness": false,
                        "tissue_distribution_centre_attributes": [
                            {
                                "id": 1,
                                "phenotype_attempt_plan_id": 1,
                                "start_date": "2015-02-16",
                                "end_date": "2015-02-16",
                                "work_unit_name": "UCD",
                                "material_type_name": "Paraffin-embedded Sections"
                            }
                        ]
                    }
                }
            ];

            return plan[0];
        }
    }
}

export let fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    //useClass: FakeBackendInterceptor,
    multi: true
}
