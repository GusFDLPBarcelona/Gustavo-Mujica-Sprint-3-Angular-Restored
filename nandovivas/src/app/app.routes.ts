import { Routes } from '@angular/router';
import { ProjectResolver } from './resolvers/project.resolver';
import { ProjectDetailComponent } from './components/project-detail/project-detail.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { ProductResolver } from './resolvers/product.resolver';

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
      import('./components/under-construction/under-construction.component').then((m) => m.UnderConstructionComponent),
  },
  {
    path: 'work',
    loadComponent: () =>
      import('./components/work/work.component').then((m) => m.WorkComponent),
  },
  {
    path: 'project-detail/:slug',
    component: ProjectDetailComponent,
    resolve: { project: ProjectResolver }
  },
  {
    path: 'product-detail/:id',
    component: ProductDetailComponent,
    resolve: { product: ProductResolver }
  },
  {
    // Panel de administración — lazy loaded, solo se descarga al acceder a /haupstadt
    path: 'haupstadt',
    loadChildren: () => import('./haupstadt/haupstadt.routes').then(m => m.haupstadtRoutes)
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
