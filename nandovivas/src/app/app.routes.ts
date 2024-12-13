import { Routes } from '@angular/router';
import { ProjectResolver } from './resolvers/project.resolver';

export const routes: Routes = [

  {
    path: '',
    loadComponent: () =>
      import('./components/wellcome/wellcome.component').then((m) => m.WellcomeComponent),
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./components/footer/footer.component').then((m) => m.FooterComponent),
  },
  {
    path: 'shop',
    loadComponent: () =>
      import('./components/shop/shop.component').then((m) => m.ShopComponent),
  },
  {
    path: 'work',
    loadComponent: () =>
      import('./components/work/work.component').then((m) => m.WorkComponent),
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: 'detail/:id',
    loadComponent: () =>
      import('./components/detail/detail.component').then((m) => m.DetailComponent),
    resolve: { project: ProjectResolver },
  },
];
