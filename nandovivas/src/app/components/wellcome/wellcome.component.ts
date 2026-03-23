import { Component, OnInit, HostListener, OnDestroy, signal, ChangeDetectorRef } from '@angular/core';
import { OwlOptions, CarouselModule } from 'ngx-owl-carousel-o';
import { ViewChild } from '@angular/core';
import { CarouselComponent } from 'ngx-owl-carousel-o';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WellcomeGalleryService } from '../../services/wellcome_gallery.service';
import { WellcomeGallery } from '../../interfaces/wellcome_gallery';

@Component({
  selector: 'app-wellcome',
  standalone: true,
  imports: [CarouselModule],
  templateUrl: './wellcome.component.html',
  styleUrls: ['./wellcome.component.css'],
})
export class WellcomeComponent implements OnInit, OnDestroy {
  imagesGallery = signal<WellcomeGallery[]>([]);
  navVisible = signal(false);
  intervalId!: number;
  private hideNavTimer: ReturnType<typeof setTimeout> | null = null;
  @ViewChild('owlCarousel', { static: false }) owlCarousel!: CarouselComponent;

  carouselOptions: OwlOptions = {
    loop: true,
    margin: 0,
    nav: false,
    dots: false,
    autoplay: true,
    autoplayHoverPause: false,
    autoplayTimeout: 8000,
    smartSpeed: 600,
    autoplaySpeed: 600,
    items: 1,
    mouseDrag: false,
    touchDrag: true,
    responsive: {
      0: { items: 1 },
      600: { items: 1 },
      1000: { items: 1 }
    }
  };

  constructor(
    private wellcomeGalleryService: WellcomeGalleryService,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadGalleryItems();
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
    if (this.hideNavTimer) clearTimeout(this.hideNavTimer);
  }

  onMouseMove(): void {
    this.navVisible.set(true);
    if (this.hideNavTimer) clearTimeout(this.hideNavTimer);
    this.hideNavTimer = setTimeout(() => this.navVisible.set(false), 2000);
  }

  onMouseLeave(): void {
    if (this.hideNavTimer) clearTimeout(this.hideNavTimer);
    this.navVisible.set(false);
  }

  loadGalleryItems() {
    this.wellcomeGalleryService.getGalleryItems().subscribe({
      next: (data) => {
        if (!Array.isArray(data) || data.length === 0) return;
        const sorted = [...data].sort((a, b) => {
          if (a.order == null && b.order == null) return 0;
          if (a.order == null) return 1;
          if (b.order == null) return -1;
          return a.order - b.order;
        });
        this.imagesGallery.set(sorted);
        setTimeout(() => this.cdr.detectChanges(), 500);
      },
      error: () => {
        this.snackBar.open('Error al cargar las imágenes', 'Cerrar', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['snack-error']
        });
      }
    });
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') {
      this.previousSlide();
    } else if (event.key === 'ArrowRight') {
      this.nextSlide();
    }
  }

  nextSlide() {
    if (this.owlCarousel && typeof this.owlCarousel.next === 'function') {
      this.owlCarousel.next();
    }
  }

  previousSlide() {
    if (this.owlCarousel && typeof this.owlCarousel.prev === 'function') {
      this.owlCarousel.prev();
    }
  }
}
