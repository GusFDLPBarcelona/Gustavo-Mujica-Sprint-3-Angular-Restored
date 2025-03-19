import { Component, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  isVisible = false;
  colors = ['#FF0000', '#FFD700', '#0000FF']; // Rojo, amarillo, azul

  constructor(private renderer: Renderer2) {}

  openContact(): void {
    this.isVisible = true;
    const randomColor = this.colors[Math.floor(Math.random() * this.colors.length)];
    this.renderer.setStyle(document.documentElement, '--contact-bg', randomColor);
  }

  closeContact(): void {
    this.isVisible = false;
  }
}
