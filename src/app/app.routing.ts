import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';

import { AuthGuard } from './core/guards/auth.guard';

const appRoutes: Routes = [
    { path: '', component: HomeComponent },
    {
      path: 'admin',
      loadChildren: './admin/admin.module#AdminModule', canActivate:[AuthGuard], canLoad: [AuthGuard]
    },

    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);
