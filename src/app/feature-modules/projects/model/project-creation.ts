import { Injectable } from '@angular/core';
import { Adapter } from 'src/app/core/model/adapter';
import { InputHandlerService } from 'src/app/core/services/input-handler.service';
import { InstitutesConsortium } from 'src/app/model';
import { Plan } from '../../plans/model/plan';
import { ProjectIntention } from './project-intention';

export class ProjectCreation {
    privacyName: string;
    speciesNames: string[];
    externalReference: string;
    comment: string;
    recovery: boolean;
    consortia: InstitutesConsortium[];
    planDetails: Plan;
    projectIntentions: ProjectIntention[];
}

@Injectable({
    providedIn: 'root'
})
export class ProjectCreationAdapter implements Adapter<ProjectCreation> {

    constructor(private inputHandlerService: InputHandlerService) {

    }
    adapt(item: any): ProjectCreation {
        const projectCreation = item as ProjectCreation;
        projectCreation.privacyName = this.inputHandlerService.getEmptyIfNull(projectCreation.privacyName);
        projectCreation.externalReference = this.inputHandlerService.getEmptyIfNull(projectCreation.externalReference);
        projectCreation.comment = this.inputHandlerService.getEmptyIfNull(projectCreation.comment);
        projectCreation.recovery = this.inputHandlerService.getFalseIfNull(projectCreation.recovery);
        return projectCreation;
    }
}
