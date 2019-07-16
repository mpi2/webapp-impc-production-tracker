import { Component, OnInit } from '@angular/core';
import { ActivatedRoute }    from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { ProjectSummary } from '../../model/project-summary';
import { ProjectAdapter } from '../../model/project';
import { PlanDetails } from 'src/app/feature-modules/plans';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit {

  project: ProjectSummary = new ProjectSummary();

  productionPlansDetails: PlanDetails[] = [];
  phenotypingPlansDetails: PlanDetails[] = [];

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private adapter: ProjectAdapter) { }

  ngOnInit() {
    let id = this.route.snapshot.params['id'];
    this.projectService.getProjectSummaryById(id).subscribe(data => {
      this.project = data;
      this.productionPlansDetails = this.project.planDetails.filter(x => 'production' === x.planTypeName);
      this.phenotypingPlansDetails = this.project.planDetails.filter(x => 'phenotyping' === x.planTypeName);
    });
  }
}
