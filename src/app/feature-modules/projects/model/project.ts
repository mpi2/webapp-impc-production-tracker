import { Injectable } from '@angular/core';
import { Adapter } from 'src/app/core/model/adapter';
import { ProjectDetails } from './project-details';

export class Project {
    projectDetails: ProjectDetails = new ProjectDetails();
}

@Injectable({
    providedIn: 'root'
})

export class ProjectAdapter implements Adapter<Project> {

    adapt(item: any): Project {
        const project: Project = new Project();
        project.projectDetails = item.projectDetails;
        return project;
    }

}
