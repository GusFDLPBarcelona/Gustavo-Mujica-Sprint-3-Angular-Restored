import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { WellcomeComponent } from './app/components/wellcome/wellcome.component';
import { routes } from './app/app.routes';

bootstrapApplication(WellcomeComponent, {
  providers: [
    provideRouter(routes) // Configuración de rutas
  ]
}).catch(err => console.error(err));
