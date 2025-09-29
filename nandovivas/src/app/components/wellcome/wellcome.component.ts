import { Component, OnInit, HostListener, OnDestroy, signal } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { WellcomeGalleryService } from '../../services/wellcome_gallery.service';
import { WellcomeGallery } from '../../interfaces/wellcome_gallery';
import { ChangeDetectorRef } from '@angular/core';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ViewChild } from '@angular/core';
import { CarouselComponent } from 'ngx-owl-carousel-o';
// ❌ ELIMINADO: import { NavbarService } from '../../services/navbar.service';

@Component({
  selector: 'app-wellcome',
  standalone: true,
  imports: [CarouselModule],
  templateUrl: './wellcome.component.html',
  styleUrls: ['./wellcome.component.css'],
})
export class WellcomeComponent implements OnInit, OnDestroy {
  imagesGallery = signal<WellcomeGallery[]>([]);
  intervalId!: number;
  @ViewChild('owlCarousel', { static: false }) owlCarousel!: CarouselComponent;

  carouselOptions: OwlOptions = {
    loop: true,
    margin: 0,
    nav: false,
    dots: false,
    autoplay: true,
    autoplayHoverPause: false,
    autoplayTimeout: 8000,
    smartSpeed: 4000,
    autoplaySpeed: 4000,
    items: 1,
    mouseDrag: true,
    touchDrag: true,
    responsive: {
      0: { items: 1 },
      600: { items: 1 },
      1000: { items: 1 }
    }
  };

  constructor(
    private wellcomeGalleryService: WellcomeGalleryService,
    private cdr: ChangeDetectorRef
    // ❌ ELIMINADO: private navbarService: NavbarService
  ) {}

  ngOnInit() {
    // ❌ ELIMINADO: this.navbarService.setShowNavbar(true);
    this.cdr.detectChanges();    
    // ❌ ELIMINADO: console.log('Componente Wellcome cargado.', this.navbarService.showNavbarSignal());
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
    clearInterval(this.intervalId);
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
  
      setTimeout(() => {
        console.log('Forzando detección de cambios...');
        this.cdr.detectChanges();
      }, 500);
    });
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