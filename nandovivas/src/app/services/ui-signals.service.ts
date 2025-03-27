import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root' 
})
export class UISignalsService {
  // Signal global para mostrar u ocultar el componente de contacto
  showContact = signal(false);

  openContact() {
    this.showContact.set(true);
  }

  closeContact() {
    this.showContact.set(false);
  }
}
