import { Component, OnInit, inject, signal, HostListener } from '@angular/core';
import { WellcomeGalleryService } from '../../services/wellcome_gallery.service';
import { WellcomeGallery } from '../../interfaces/wellcome_gallery';

@Component({
  selector: 'app-wellcome',
  standalone: true,
  templateUrl: './wellcome.component.html',
  styleUrls: ['./wellcome.component.css'],
})
export class WellcomeComponent implements OnInit {
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
      this.nextImage(); // Cambia automáticamente cada 3 segundos
    }, 3000);
  }

  nextImage() {
    const imagesLength = this.imagesGallery().length;
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
    const imagesLength = this.imagesGallery().length;
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
    const totalImages = this.imagesGallery().length;

    if (event.key === 'ArrowLeft' && totalImages !== 0) {
      this.prevImage();
    } else if (event.key === 'ArrowRight' && totalImages !== 0) {
      this.nextImage();
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
    const totalImages = this.imagesGallery().length;
    this.currentIndex.set(totalImages - 1);
    this.updateTrackPosition(true);
  }
}
