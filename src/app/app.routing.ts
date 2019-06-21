import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';

import { AuthGuard } from './core/guards';
import { GeneSearchComponent } from './gene-search/gene-search.component';
import { CreateProjectComponent } from './projects/components/create-project/create-project.component';
import { CrisprAttemptComponent } from './crispr-attempt/crispr-attempt.component';

const appRoutes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'search', component: GeneSearchComponent },
    { path: 'create_project', component: CreateProjectComponent },
    { path: 'crispr_attempt', component: CrisprAttemptComponent },

    {
      path: 'admin',
      loadChildren: './admin/admin.module#AdminModule', canActivate:[AuthGuard], canLoad: [AuthGuard]
    },

    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);
