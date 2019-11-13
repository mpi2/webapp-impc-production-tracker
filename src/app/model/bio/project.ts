import { ProjectLinks } from '../../feature-modules/projects/model/project-links';
import { Injectable } from '@angular/core';
import { Adapter } from 'src/app/core/model/adapter';
import { InstitutesConsortium, ProjectIntention, StatusDate } from '..';

export class Project {
    id: number;
    tpn: string;
    imitsMiPlanId: number;
    assignmentStatusName: string;
    assignmentStatusDates: StatusDate[];
    isObjectRestricted: boolean;

    institutesConsortium: InstitutesConsortium[];
    privacyName: string;
    species: string[];
    externalReference: string;
    projectIntentions: ProjectIntention[];
    withdrawn: boolean;
    recovery: boolean;
    isActive: boolean;
    comment: string;

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
