import { Routes } from '@angular/router';

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
    path: 'detail/:id',
    loadComponent: () =>
      import('./components/detail/detail.component').then((m) => m.DetailComponent),
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
