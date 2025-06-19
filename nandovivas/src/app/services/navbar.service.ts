import { Injectable, signal, inject, effect } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class NavbarService {
  private showNavbarSignal = signal(true);

  // Getter reactivo para el binding en el template
  showNavbar = this.showNavbarSignal;

  // Setter para cambiar visibilidad
  setShowNavbar(value: boolean): void {
    this.showNavbarSignal.set(value);
  }

  // Inyectamos Router para observar ruta actual
  private router = inject(Router);

  // Optional: efecto que muestra la navbar si se navega a '/'
  private _routeEffect = effect(
    () => {
      const url = this.router.url;
      if (url === '/' || url === '/home') {
        this.setShowNavbar(true);
      }
    },
    { allowSignalWrites: true } // Permitir escritura en el efecto
  );
}
