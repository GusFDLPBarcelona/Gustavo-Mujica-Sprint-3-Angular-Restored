import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class NavbarService {
  public currentRoute = signal<string>('');

  constructor(private router: Router) {
    // Detectar cambios de ruta
    this.router.events.subscribe(() => {
      this.currentRoute.set(this.router.url);
    });
  }
  
  // Computed para saber si estamos en welcome
  isWelcomeRoute = computed(() => this.currentRoute() === '/' || this.currentRoute() === '/welcome');
}