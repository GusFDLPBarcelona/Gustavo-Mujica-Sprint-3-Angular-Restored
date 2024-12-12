import { Component, HostListener, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-wellcome',
  standalone: true,
  templateUrl: './wellcome.component.html',
  styleUrls: ['./wellcome.component.css']
})
export class WellcomeComponent implements OnInit {
  images = signal<string[]>([
    'arnold-personal-work-typegace-serif-art-nouveau-font-nando-vivas-grid-1100x692.png',
    'attached-ren-hang-personal-work-editorial-design-nando-vivas-grid-1100x692.png',
    'comunitzar-la-musica-ajuntament-de-barcelona-poster-design-nando-vivas-grid-1100x692.png',
    // Agregar las demás imágenes
  ]);

  currentDirection = signal<'left' | 'right'>('right');
  speed = signal(1); // Velocidad de desplazamiento

  ngOnInit() {
    this.startCarousel();
  }

  startCarousel() {
    setInterval(() => {
      // Lógica para mover las imágenes según la dirección actual
      const direction = this.currentDirection();
      const speed = this.speed();

      // lógica para actualizar el desplazamiento 
    }, 1000 / 60); // Animación suave 60fps
  }

  changeDirection(direction: 'left' | 'right') {
    this.currentDirection.set(direction);
  }

  increaseSpeed() {
    this.speed.set(this.speed() + 1);
  }

  decreaseSpeed() {
    this.speed.set(Math.max(1, this.speed() - 1));
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent) {
    if (event.key === 'ArrowRight') {
      this.changeDirection('right');
      this.increaseSpeed();
    } else if (event.key === 'ArrowLeft') {
      this.changeDirection('left');
      this.increaseSpeed();
    }
  }
}
