import { Component, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EmailModalComponent } from '../email-modal/email-modal.component';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  isVisible = false;
  colors = ['#FF0000', '#FFD700', '#0000FF']; // Rojo, amarillo, azul

  constructor(private renderer: Renderer2, public dialog: MatDialog) {}

  openContact(): void {
    this.isVisible = true;
    const randomColor = this.colors[Math.floor(Math.random() * this.colors.length)];
    this.renderer.setStyle(document.documentElement, '--contact-bg', randomColor);
  }

  closeContact(): void {
    this.isVisible = false;
  }

  openEmailModal(): void {
    this.dialog.open(EmailModalComponent, {
      width: '400px',
      panelClass: 'custom-modal'
    });
  }
}
