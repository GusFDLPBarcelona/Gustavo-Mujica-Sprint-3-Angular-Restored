import { Component, OnInit, inject, signal, HostListener } from '@angular/core';
import { ProjectsService } from '../../services/projects.service';
import { Project } from '../../interfaces/project';

@Component({
  selector: 'app-wellcome',
  standalone: true,
  templateUrl: './wellcome.component.html',
  styleUrls: ['./wellcome.component.css'],
})
export class WellcomeComponent implements OnInit {
  private projectService = inject(ProjectsService);
  images = signal<string[]>([]);
  currentIndex = signal<number>(0);
  intervalId!: number; 
  showArrows = signal<boolean>(false);
  arrowTimeout!: number;
  
  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.projectService.getProjects().subscribe((projects: Project[]) => {
      const imagePaths = projects.map((p) => p.image);
      this.images.set(imagePaths); // Actualiza las imágenes
      this.startCarousel(); // Inicia el carrusel después de cargar
    });
  }

  startCarousel() {
    clearInterval(this.intervalId); // Limpia intervalos previos
    this.intervalId = window.setInterval(() => {
      console.log('Cambiando imagen automáticamente...');
      this.nextImage(); // Cambia automáticamente cada 5 segundos
    }, 3000);
  }

  nextImage() {
    const imagesLength = this.images().length;
    if (imagesLength === 0) return;
    if (this.currentIndex() === imagesLength - 1) {
      this.currentIndex.set(0);
      this.updateTrackPosition(false); // Sin transición
      setTimeout(() => {
        this.currentIndex.set(1);
        this.updateTrackPosition(true); // Con transición
      }, 50);
    } else {
      this.currentIndex.set((this.currentIndex() + 1) % imagesLength);
      this.updateTrackPosition(true); // Con transición
    }
  }

  prevImage() {
    const imagesLength = this.images().length;
    if (imagesLength === 0) return;
    if (this.currentIndex() === 0) {
      this.currentIndex.set(imagesLength - 1);
      this.updateTrackPosition(false); // Sin transición
      setTimeout(() => {
        this.currentIndex.set(imagesLength - 2);
        this.updateTrackPosition(true); // Con transición
      }, 50);
    } else {
      this.currentIndex.set((this.currentIndex() - 1 + imagesLength) % imagesLength);
      this.updateTrackPosition(true); // Con transición
    }
  }

  updateTrackPosition(withTransition: boolean) {
    const track = document.querySelector('.carousel-track') as HTMLElement;
    if (!track) {
      console.error('Elemento .carousel-track no encontrado.');
      return;
    }

    const currentIndex = this.currentIndex();
    if (withTransition) {
      track.style.transition = 'transform 1s ease-in-out'; // Transición suave
    } else {
      track.style.transition = 'none'; // Sin transición
    }
    track.style.transform = `translateX(-${currentIndex * 100}vw)`; // Mueve horizontalmente
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent) {
    console.log('Tecla presionada:', event.key);
    if (event.key === 'ArrowLeft' && this.images().length !== 0) {
      this.prevImage();
    } else {
      this.backToEnd();
    }
    if (
      event.key === 'ArrowRight' &&
      this.images().length !== this.images.length
    ) {
      this.nextImage();
    } else {
      this.backToTop();
    }

    this.showArrows.set(true);
    clearTimeout(this.arrowTimeout); // Limpia cualquier timeout previo
    this.arrowTimeout = window.setTimeout(() => {
      this.showArrows.set(false); // Oculta las flechas después de 2 segundos
    }, 2000);

    this.startCarousel();
  }

  backToTop() {
    this.currentIndex.set(0);
    this.updateTrackPosition(true);
  }

  backToEnd() {
    this.currentIndex.set(this.images.length);
    this.updateTrackPosition(true);
  }
}
