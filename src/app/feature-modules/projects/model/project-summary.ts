
import { ProjectDetails } from './project-details';
import { Adapter } from 'src/app/core/model/adapter';
import { Injectable } from '@angular/core';
import { PlanDetails } from '../../plans';

export class ProjectSummary {
    projectDetails: ProjectDetails = new ProjectDetails();
    planDetails: PlanDetails[];
    abortedMis = [];
    misInProgress = [];
    genotypeConfirmedMis = [];
    breedingAttempts = [];
    phenotypeAttempts = [];
}

@Injectable({
    providedIn: 'root'
})

export class ProjectSummaryAdapter implements Adapter<ProjectSummary> {
    adapt(item: any): ProjectSummary {
        return item;
        const projectSummary: ProjectSummary = new ProjectSummary();
        projectSummary.planDetails = item.planDetails;
        // Sort so production plans come first that phenotype plans.
        projectSummary.planDetails.sort(function (a, b) {
            var nameA = a.planTypeName.toUpperCase();
            var nameB = b.planTypeName.toUpperCase();
            if (nameA < nameB) {
                return 1;
            }
            if (nameA > nameB) {
                return -1;
            }
            return 0;
        });

        projectSummary.projectDetails = item.projectDetails;

        const abortedMis = [];
        const misInProgress = [];
        const genotypeConfirmedMis = [];
        const breedingAttempts = [];
        const phenotypeAttempts = [];
        const breedingStatuses = ['Mouse Allele Modification Registered', 'Rederivation Started', 'Rederivation Complete',
            'Cre Excision Started', 'Cre Excision Complete', 'Mouse Allele Modification Aborted'];
        const miInProgress = [' Micro-injection in progress', 'Chimeras obtained', 'Founder obtained', 'Chimeras/Founder obtained'];

        item.planDetails.forEach(element => {
            const workUnit = element.workUnitName;
            const workGroup = element.workGroupName;
            const status = element.statusName;
            const planInfo = '[' + workUnit + '::' + workGroup + '::' + status + ']';
            if (element.planTypeName === 'phenotyping') {
                phenotypeAttempts.push(planInfo);
            } else if (breedingStatuses.includes(element.statusName)) {
                breedingAttempts.push(planInfo);
            } else if (element.statusName === 'Micro-injection aborted') {
                abortedMis.push(planInfo);
            } else if (miInProgress.includes(element.statusName)) {
                misInProgress.push(planInfo);
            } else if (element.statusName === 'Genotype confirmed') {
                genotypeConfirmedMis.push(planInfo);
            }
        });

        projectSummary.phenotypeAttempts = phenotypeAttempts;
        projectSummary.breedingAttempts = breedingAttempts;
        projectSummary.abortedMis = abortedMis;
        projectSummary.misInProgress = misInProgress;
        projectSummary.genotypeConfirmedMis = genotypeConfirmedMis;

        return projectSummary;
    }
}


