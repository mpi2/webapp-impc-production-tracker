import { Component, OnInit } from '@angular/core';
import { ActivatedRoute }    from '@angular/router';
import { Project, ProjectAdapter } from 'src/app/_models';
import { ProjectService } from 'src/app/_services';
import { first, map } from 'rxjs/operators';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit {
  project: Project = new Project()

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private adapter: ProjectAdapter) { }

  ngOnInit() {
    let id = this.route.snapshot.params['id'];
    this.projectService.getProject(id).pipe(first()).subscribe(data => {
      this.project = this.adapter.adapt(data);
      console.log('Project (Adapted):::', this.project);
      
    });
  }
}
