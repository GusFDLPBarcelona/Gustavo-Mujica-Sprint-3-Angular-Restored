import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const haupstadtRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    loadComponent: () => import('./components/layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'carousel',
        loadComponent: () => import('./components/welcome-list/welcome-list.component').then(m => m.WelcomeListComponent)
      },
      {
        path: 'carousel/new',
        loadComponent: () => import('./components/welcome-form/welcome-form.component').then(m => m.WelcomeFormComponent)
      },
      {
        path: 'carousel/:id',
        loadComponent: () => import('./components/welcome-form/welcome-form.component').then(m => m.WelcomeFormComponent)
      }
    ]
  }
];
