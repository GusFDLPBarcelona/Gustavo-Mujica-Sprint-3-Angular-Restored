import { Component, OnInit, inject, signal, HostListener, OnDestroy } from '@angular/core';
import { WellcomeGalleryService } from '../../services/wellcome_gallery.service';
import { WellcomeGallery } from '../../interfaces/wellcome_gallery';

@Component({
  selector: 'app-wellcome',
  standalone: true,
  templateUrl: './wellcome.component.html',
  styleUrls: ['./wellcome.component.css'],
})
export class WellcomeComponent implements OnInit, OnDestroy{
  imagesGallery = signal<WellcomeGallery[]>([]); // Imágenes y datos de wellcome_gallery
  currentIndex = signal<number>(0);
  intervalId!: number;
  showArrows = signal<boolean>(false);
  arrowTimeout!: number;

  constructor(private wellcomeGalleryService: WellcomeGalleryService) {}

  ngOnInit() {
    console.log('Componente Wellcome cargado.');
    this.loadGalleryItems(); // Cargar imágenes y datos de wellcome_gallery
  }

  ngOnDestroy() {
    console.log('Componente Wellcome destruido.');
    this.stopCarousel(); // Detener el carrusel
    clearTimeout(this.arrowTimeout); // Limpiar el timeout de las flechas
  }

  loadGalleryItems() {
    this.wellcomeGalleryService.getGalleryItems().subscribe((data) => {
      console.log('Solicitud GET recibida en /api/gallery'); 
      this.imagesGallery.set(data); 
      console.log('Galería cargada:', data); 
      this.startCarousel(); 
    });
  }

  startCarousel() {
    clearInterval(this.intervalId); // Limpia intervalos previos
    this.intervalId = window.setInterval(() => {
      console.log('Cambiando imagen automáticamente...');
      this.moveToNext(); // Cambia automáticamente cada 3 segundos
    }, 3000);
  }

  stopCarousel() {
    clearInterval(this.intervalId); // Detiene el carrusel
    console.log('Carrusel detenido.');
  }

  moveToNext() {
    const imagesLength = this.imagesGallery().length;
    if (imagesLength === 0) return;
    this.currentIndex.set((this.currentIndex() + 1) % imagesLength);
    this.updateTrackPosition(true); // Con transición
  }

  moveToPrev() {
    const imagesLength = this.imagesGallery().length;
    if (imagesLength === 0) return;
    this.currentIndex.set((this.currentIndex() - 1 + imagesLength) % imagesLength);
    this.updateTrackPosition(true); // Con transición
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

  showAndHideArrows() {
    this.showArrows.set(true);
    clearTimeout(this.arrowTimeout); // Limpia cualquier timeout previo
    this.arrowTimeout = window.setTimeout(() => {
      this.showArrows.set(false); // Oculta las flechas después de 1 segundo
    }, 1000);
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent) {
    console.log('Tecla presionada:', event.key);
    const totalImages = this.imagesGallery().length;

    if (event.key === 'ArrowLeft' && totalImages !== 0) {
      this.moveToPrev();
    } else if (event.key === 'ArrowRight' && totalImages !== 0) {
      this.moveToNext();
    }

    this.showAndHideArrows();
    this.startCarousel();
  }

  onArrowClick(direction: 'prev' | 'next') {
    if (direction === 'prev') {
      this.moveToPrev();
    } else if (direction === 'next') {
      this.moveToNext();
    }
    this.showAndHideArrows();
  }

  backToTop() {
    this.currentIndex.set(0);
    this.updateTrackPosition(true);
  }

  backToEnd() {
    const totalImages = this.imagesGallery().length;
    this.currentIndex.set(totalImages - 1);
    this.updateTrackPosition(true);
  }

  handleTransitionEnd() {
    const track = document.querySelector('.carousel-track') as HTMLElement;
    if (this.currentIndex() === this.imagesGallery().length) {
      //track.style.transition = 'none';
      this.currentIndex.set(0);
      track.style.transform = `translateX(0)`;
      void track.offsetWidth; // Forzar reflujo
      track.style.transition = 'transform 3s ease-in-out';
    }
  }
}
