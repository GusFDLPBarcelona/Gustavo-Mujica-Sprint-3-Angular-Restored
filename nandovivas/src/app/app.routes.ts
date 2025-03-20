import { Routes } from '@angular/router';
import { ProjectResolver } from './resolvers/project.resolver';
import { ProjectDetailComponent } from './components/project-detail/project-detail.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { ProductResolver } from './resolvers/product.resolver';
//import { HaupstadtComponent } from './components/haupstadt/haupstadt.component';
//import { HaupstadtResolver } from './resolvers/haupstadt.resolver';

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
  //{ path: 'haupstadt', loadComponent: () => 
  //    import('./components/haupstadt/haupstadt.component').then((m) => m.HaupstadtComponent)
  //},
  {
    path: 'work',
    loadComponent: () =>
      import('./components/work/work.component').then((m) => m.WorkComponent),
  },
  //{ path: 'haupstadt', component: HaupstadtComponent, resolve: { products: HaupstadtResolver } 
  //},
  {
    path: 'project-detail/:id',
    component: ProjectDetailComponent, // Cambia al nuevo nombre
    resolve: { project: ProjectResolver }
  },
  {
    path: 'product-detail/:id',
    component: ProductDetailComponent,
    resolve: { product: ProductResolver }
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
