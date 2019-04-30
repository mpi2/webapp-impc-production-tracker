import { Component, OnInit } from '@angular/core';
import { ActivatedRoute }    from '@angular/router';
import { Project } from 'src/app/_models';
import { ProjectService } from 'src/app/_services';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit {
  project: Project = new Project()

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService) { }

  ngOnInit() {
    let id = this.route.snapshot.params['id'];
    console.log('The page was called with project id: '+ id);
    this.projectService.getProject(id).pipe(first()).subscribe(project => {
      this.project = project;
      console.log('Project obtained: ', this.project);
      console.log('Project.phenotypingPlanSummaries obtained: ', this.project.phenotypePlanSummaries);
    });
  }

}
