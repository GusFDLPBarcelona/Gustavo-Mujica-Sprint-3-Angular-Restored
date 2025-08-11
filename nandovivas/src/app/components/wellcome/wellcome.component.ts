import { Component, OnInit, HostListener, OnDestroy, signal } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { WellcomeGalleryService } from '../../services/wellcome_gallery.service';
import { WellcomeGallery } from '../../interfaces/wellcome_gallery';
import { ChangeDetectorRef } from '@angular/core';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ViewChild } from '@angular/core';
import { CarouselComponent } from 'ngx-owl-carousel-o';
import { NavbarService } from '../../services/navbar.service';


@Component({
  selector: 'app-wellcome',
  standalone: true,
  imports: [CarouselModule],
  templateUrl: './wellcome.component.html',
  styleUrls: ['./wellcome.component.css'],
})
export class WellcomeComponent implements OnInit, OnDestroy {
  imagesGallery = signal<WellcomeGallery[]>([]);
  styledImages = signal<(WellcomeGallery & { color: string })[]>([]);
  intervalId!: number;
  @ViewChild('owlCarousel', { static: false }) owlCarousel!: CarouselComponent;
  primaryColors = [
    '#007AFF', // azul
    '#34C759', // verde
    '#FF3B30', // rojo
    '#FFFFFF'  // blanco
  ];

  carouselOptions: OwlOptions = {
    loop: true,
    margin: 0,
    nav: false,
    dots: false,
    autoplay: true,
    autoplayHoverPause: false,
    autoplayTimeout:5000, 
    smartSpeed: 3000, 
    autoplaySpeed: 2000,
    items: 1,
    mouseDrag: true,
    touchDrag: true,
    responsive: {
      0: { items: 1 },
      600: { items: 1 },
      1000: { items: 1 }
    }
  };

  constructor(private wellcomeGalleryService: WellcomeGalleryService,
    private cdr: ChangeDetectorRef, private navbarService: NavbarService) {}

  ngOnInit() {
    this.navbarService.setShowNavbar(true);
    this.cdr.detectChanges();    
    console.log('Componente Wellcome cargado.');
    this.loadGalleryItems();

    setTimeout(() => {
      console.log('Verificando si el HTML detecta los datos...');
      console.log('imagesGallery en HTML:', this.imagesGallery());
      this.cdr.detectChanges();
    }, 200);
  }

  ngOnDestroy() {
    console.log('Componente Wellcome destruido.');
    this.stopCarousel();
  }

  loadGalleryItems() {
    console.log('🚀 Iniciando carga de imágenes...'); 
  
    this.wellcomeGalleryService.getGalleryItems().subscribe((data) => {
      console.log('Datos recibidos del servicio:', data); 
  
      if (!Array.isArray(data) || data.length === 0) {
        console.error('Error: No hay imágenes para mostrar');
        return;
      }
  
      console.log('Antes de asignar imágenes:', this.imagesGallery()); 
      this.imagesGallery.set(data); 
      console.log('Después de asignar imágenes:', this.imagesGallery());
      this.assignColorsToImages(); 
  
      setTimeout(() => {
        console.log('Forzando detección de cambios...');
        this.cdr.detectChanges();
        this.startCarousel();
      }, 500);
    });
  }

  getRandomColor(): string {
    const index = Math.floor(Math.random() * this.primaryColors.length);
    return this.primaryColors[index];
  }
  
  getStyledImages() {
    return this.imagesGallery().map((img) => ({
      ...img,
      color: this.getRandomColor(),
    }));
  }
  
  assignColorsToImages() {
    const images = this.imagesGallery();
    const result: (WellcomeGallery & { color: string })[] = [];
    let lastColor = '';
  
    images.forEach((img) => {
      let color = this.getRandomColor();
  
      // Evita repetir el mismo color justo después
      while (color === lastColor && this.primaryColors.length > 1) {
        color = this.getRandomColor();
      }
  
      lastColor = color;
  
      result.push({
        ...img,
        color,
      });
    });
  
    this.styledImages.set(result);
  }

  startCarousel() {
    clearInterval(this.intervalId);
    this.intervalId = window.setInterval(() => {
      console.log('Cambiando imagen automáticamente...');
      this.nextSlide();
    }, 3000);
  }

  stopCarousel() {
    clearInterval(this.intervalId);
    console.log('Carrusel detenido.');
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent) {
    console.log('Tecla presionada:', event.key);
    if (event.key === 'ArrowLeft') {
      this.previousSlide();
    } else if (event.key === 'ArrowRight') {
      this.nextSlide();
    }
  }

  nextSlide() {
    console.log('Siguiente imagen');
    if (this.owlCarousel && typeof this.owlCarousel.next === 'function') {
      this.owlCarousel.next();
    } else {
      console.warn('No se puede avanzar: owlCarousel no está disponible');
    }
  }
  
  previousSlide() {
    console.log('Imagen anterior');
    if (this.owlCarousel && typeof this.owlCarousel.prev === 'function') {
      this.owlCarousel.prev();
    } else {
      console.warn('No se puede retroceder: owlCarousel no está disponible');
    }
  }
}
