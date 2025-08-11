import { Injectable, signal, inject, effect } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class NavbarService {
  public showNavbarSignal = signal(true);

  // Getter reactivo para el binding en el template
  showNavbar = this.showNavbarSignal;

  // Setter para cambiar visibilidad
  setShowNavbar(value: boolean): void {
    console.log("Cambiando visibilidad de la navbar a:", value);
    this.showNavbarSignal.set(value);
    console.log("signal en servicio",this.showNavbarSignal());
  }


}
