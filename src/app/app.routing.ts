import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';

import { AuthGuard } from './_guards';
import { RegistrationFormComponent } from './registration-form/registration-form.component';
import { GeneSearchComponent } from './gene-search/gene-search.component';
import { ProjectDetailComponent } from './project/project-detail/project-detail.component';
import { ProjectsComponent } from './project/projects/projects.component';
import { CreateProjectComponent } from './create-project/create-project.component';
import { CrisprAttemptComponent } from './crispr-attempt/crispr-attempt.component';

const appRoutes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },

    { path: 'app-registration-form', component: RegistrationFormComponent, canActivate: [AuthGuard] },
    { path: 'search', component: GeneSearchComponent },
    { path: 'projects/:id', component: ProjectDetailComponent },
    { path: 'projects', component: ProjectsComponent },
    { path: 'create_project', component: CreateProjectComponent },
    { path: 'crispr_attempt', component: CrisprAttemptComponent },

    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);
