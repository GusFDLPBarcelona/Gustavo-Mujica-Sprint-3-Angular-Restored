import { Routes } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { ShopComponent } from './components/shop/shop.component';
import { DetailComponent } from './components/detail/detail.component';
import { WellcomeComponent } from './components/wellcome/wellcome.component'; 

export const routes: Routes = [
    { path: '', component: WellcomeComponent },  // Ruta raíz para mostrar "wellcome" como pantalla de inicio // Ruta para "work"
    { path: 'contact', component: FooterComponent },  // Ruta para "contact" en footer
    { path: 'shop', component: ShopComponent },  // Ruta para "shop"
    { path: 'detail/:id', component: DetailComponent }, // Ruta para el detalle de un proyecto
    { path: '**', redirectTo: '', pathMatch: 'full' } // Redirección para rutas desconocidas
];
