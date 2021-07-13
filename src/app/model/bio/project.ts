/* eslint-disable no-underscore-dangle */
import { ProjectLinks } from '../../feature-modules/projects/model/project-links';
import { Injectable } from '@angular/core';
import { Adapter } from 'src/app/core/model/adapter';
import { InstitutesConsortium, StatusDate, EsCellQc } from '..';
import { ProjectIntention } from 'src/app/feature-modules/projects/model/project-intention';

export class Project {
    id: number;
    tpn: string;
    imitsMiPlanId: number;
    assignmentStatusName: string;
    summaryStatusName: string;
    assignmentStatusStamps: StatusDate[];
    isObjectRestricted: boolean;
    consortia: InstitutesConsortium[];
    privacyName: string;
    species: string[];
    projectIntentions: ProjectIntention[];
    comment: string;
    relatedWorkUnitNames: string[];
    relatedWorkGroupNames: string[];
    colonyNames: string[];
    phenotypingExternalRefs: string[];
    recovery: boolean;
    completionNote: string;
    completionComment: string;
    esCellDetails: EsCellQc;
    _links: ProjectLinks;
}

@Injectable({
    providedIn: 'root'
})
export class ProjectAdapter implements Adapter<Project> {
    adapt(item: any): Project {
        const project: Project = item;
        if (project._links) {
            if (project._links.productionPlans) {
                project._links.productionPlans = this.convertElementToArray(project._links.productionPlans);
            }

            if (project._links.phenotypingPlans) {
                project._links.phenotypingPlans = this.convertElementToArray(project._links.phenotypingPlans);
            }
        } else {
            project._links = new ProjectLinks();
        }
        return project;
    }

    private convertElementToArray(element: any): any[] {
        if (!Array.isArray(element)) {
            return [element];
        }
        return element;
    }
}
