import { ProjectLinks } from '../../../feature-modules/projects/model/project-links';
import { Injectable } from '@angular/core';
import { Adapter } from 'src/app/core/model/adapter';
import { StatusDate } from './status-date';
import { IntentionByGene } from './intention-by-gene';
import { IntentionByLocation } from './intention-by-location';

export class Project {
    id: number;
    tpn: string;
    privacyName: string;
    assignmentStatusName: string;
    assignmentStatusDates: StatusDate[];
    withdrawn: boolean;
    recovery: boolean;
    intentionsByGene: IntentionByGene[];
    intentionsByLocation: IntentionByLocation[];
    imitsMiPlanId: number;
    comment: string;
    isObjectRestricted: boolean;
    isActive: boolean;
    links: ProjectLinks;
}

@Injectable({
    providedIn: 'root'
})
export class ProjectAdapter implements Adapter<Project> {
    adapt(item: any): Project {
        const project: Project = item;
        if (project.links) {
            if (project.links.production_plans) {
                project.links.production_plans = this.convertElementToArray(project.links.production_plans);
            }

            if (project.links.phenotyping_plans) {
                project.links.phenotyping_plans = this.convertElementToArray(project.links.phenotyping_plans);
            }
        } else {
            project.links = new ProjectLinks();
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
