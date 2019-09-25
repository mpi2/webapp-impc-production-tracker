import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { ProjectDetailComponent } from './components/project-detail/project-detail.component';
import { CreateProjectComponent } from './components/create-project/create-project.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { HistoryComponent } from 'src/app/shared/components/history/history.component';
import { ProductionPlanComponent } from '../plans/components/production-plan/production-plan.component';
import { PhenotypingPlanComponent } from '../plans/components/phenotyping-plan/phenotyping-plan.component';

const routes: Routes = [
  {
    path: 'projects/:id', component: ProjectDetailComponent,
  },
  {
    path: 'projects/:id/production-plan/:pid', component: ProductionPlanComponent,
    data: {
      title: 'Production Plan',
      breadcrumb: [
        {
          label: 'Project {{ id }}',
          url: 'projects/:id'
        },
        {
          label: 'Plan {{ pid }}',
          url: ''
        }
      ]
    }
  },
  {
    path: 'projects/:id/phenotyping-plan/:pid', component: PhenotypingPlanComponent,
    data: {
      title: 'Phenotyping Plan',
      breadcrumb: [
        {
          label: 'Project {{ id }}',
          url: 'projects/:id'
        },
        {
          label: 'Plan {{ pid }}',
          url: ''
        }
      ]
    }
  },

  {
    path: 'projects/:id/history', component: HistoryComponent,
    data: {
      title: 'Project History',
      id: 'id',
      entity: 'project',
      breadcrumb: [
        {
          label: 'Project {{ id }}',
          url: 'projects/:id'
        },
        {
          label: 'History',
          url: ''
        }
      ]
    }
  },

  {
    path: 'projects/:id/production-plan/:pid/history', component: HistoryComponent
    , data: {
      id: 'pid',
      entity: 'plan',
      title: 'Production Plan',
      breadcrumb: [
        {
          label: 'Project {{ id }}',
          url: 'projects/:id'
        },
        {
          label: 'Plan {{ pid }}',
          url: 'projects/:id/production-plan/:pid'
        }
        ,
        {
          label: 'History',
          url: ''
        }
      ]
    }
  },
  {
    path: 'projects/:id/phenotyping-plan/:pid/history', component: HistoryComponent, data: {
      id: 'pid',
      entity: 'plan',
      title: 'Phenotyping Plan',
      breadcrumb: [
        {
          label: 'Project {{ id }}',
          url: 'projects/:id'
        },
        {
          label: 'Phenotyping plan {{ pid }}',
          url: 'projects/:id/phenotyping-plan/:pid'
        }
        ,
        {
          label: 'History',
          url: ''
        }
      ]
    }
  },

  { path: 'projects', component: ProjectListComponent },
  { path: 'create-project', component: CreateProjectComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule { }
