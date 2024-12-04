import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { WellcomeComponent } from './app/components/wellcome/wellcome.component';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

bootstrapApplication(WellcomeComponent, {
  providers: [
    provideRouter(routes), provideAnimationsAsync() // Configuración de rutas
  ]
}).catch(err => console.error(err));
