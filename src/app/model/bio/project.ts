import { ProjectLinks } from '../../feature-modules/projects/model/project-links';
import { Injectable } from '@angular/core';
import { Adapter } from 'src/app/core/model/adapter';
import { StatusDate } from './status-date';
import { ProjectIntention } from './project-intention';
import { IntentionByGene } from './intention-by-gene';

export class Project {
    id: number;
    tpn: string;
    privacyName: string;
    assignmentStatusName: string;
    assignmentStatusDates: StatusDate[];
    withdrawn: boolean;
    recovery: boolean;
    projectIntentions: ProjectIntention[];
    imitsMiPlanId: number;
    comment: string;
    isObjectRestricted: boolean;
    isActive: boolean;
    // tslint:disable-next-line
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
