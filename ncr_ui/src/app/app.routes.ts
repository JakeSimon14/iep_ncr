import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { NcrLayoutComponent } from './layout/ncr-layout/ncr-layout.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path : 'login',
        component : LoginComponent
    },
    {
        path: '',
        component: NcrLayoutComponent,
        canActivate: [authGuard],
        children: [
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
          { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)}
        ]
    }
];
