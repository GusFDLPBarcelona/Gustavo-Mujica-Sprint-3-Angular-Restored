import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class NavbarService {
  public showNavbarSignal = signal<boolean>(true);
  public currentRoute = signal<string>('');

  constructor(private router: Router) {
    // Detectar cambios de ruta
    this.router.events.subscribe(() => {
      this.currentRoute.set(this.router.url);
    });
  }

  // Getter reactivo para el binding en el template
  showNavbar = this.showNavbarSignal;
  
  // Computed para saber si estamos en welcome
  isWelcomeRoute = computed(() => this.currentRoute() === '/' || this.currentRoute() === '/welcome');

  // Setter para cambiar visibilidad
  setShowNavbar(value: boolean): void {
    if (!value) {
      if (this.router.url === '/') {
        console.log("Ruta '', no se oculta la navbar.");
      } else {
        this.showNavbarSignal.set(value);
      }
    } else {
      console.log("Cambiando visibilidad de la navbar a:", value);
      this.showNavbarSignal.set(value);
    }
  }

  forceSetShowNavbar(value: boolean) {
    console.log("Forzando visibilidad de la navbar a:", value);
    this.showNavbarSignal.set(value);
  }
}