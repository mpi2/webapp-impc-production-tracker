import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../model/project';
import { PlanService } from 'src/app/feature-modules/plans';
import { Plan } from 'src/app/feature-modules/plans/model/plan';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit {

  project: Project = new Project();

  productionPlansDetails: Plan[] = [];
  phenotypingPlansDetails: Plan[] = [];

  assignmentStatusDatesColumns = ['name', 'date'];

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private planService: PlanService) { }

  ngOnInit() {
    this.getProjectData();
  }

  private getProjectData() {
    let id = this.route.snapshot.params['id'];
    this.projectService.getProject(id).subscribe(data => {
      this.project = data;
      console.log('this.project', this.project );
      
      this.getProductionPlans();
      this.gethenotypingPlans();
    });
  }

  private getProductionPlans() {
    this.project._links.production_plans.map(x => {
      this.planService.getPlanByUrl(x.href).subscribe(plan => {
        console.log('the url', x.href);
        
        console.log('Got a production plan', plan);
        
        this.productionPlansDetails.push(plan);
      }, error => {
        console.log('Error getting plan...', error);
      });
    });
  }

  private gethenotypingPlans() {
    this.project._links.phenotyping_plans.map(x => {
      this.planService.getPlanByUrl(x.href).subscribe(plan => {
        this.phenotypingPlansDetails.push(plan);
      }, error => {
        console.log('Error getting plan...', error);
      });
    });
  }
}
