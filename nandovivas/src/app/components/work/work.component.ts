import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild,
  inject,
  signal,
  computed,
  HostListener,
  OnDestroy
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProjectsService } from '../../services/projects.service';
import { Project } from '../../interfaces/project';
import { ToastService } from '../../services/toast.service';
import { CommonModule } from '@angular/common';
import autoAnimate from '@formkit/auto-animate';
import { NavbarService } from '../../services/navbar.service';

@Component({
  selector: 'app-work',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.css']
})
export class WorkComponent implements OnInit, AfterViewInit, OnDestroy {
  private el = inject(ElementRef);
  private projectsService = inject(ProjectsService);
  private navbarService = inject(NavbarService);
  private toastService = inject(ToastService);
  private lastScrollPosition = 0;
  private isNavbarHidden = false;
  private observer: IntersectionObserver | null = null;

  @ViewChild('observerAnchor') observerAnchorRef!: ElementRef;
  @ViewChild('gridContainer', { read: ElementRef }) gridContainer!: ElementRef;

  projects = signal<Project[]>([]);
  activeCategory = signal<string>('All');
  isLoading = computed(() => this.projectsService.isLoading.value);

  isMobile = signal(window.innerWidth <= 767);
  dropdownOpen = signal(false);
  categories = ['All', 'Editorial', 'Branding', 'Typography', 'Packaging', 'Illustration', 'Web & SM'];

  filteredProjects = computed(() => {
    const category = this.activeCategory();
    return this.projects()
      .map((project, index) => ({
        ...project,
        matchesFilter: project.category === category,
        originalOrder: index
      }))
      .sort((a, b) => {
        if (a.matchesFilter && !b.matchesFilter) return -1;
        if (!a.matchesFilter && b.matchesFilter) return 1;
        return a.originalOrder - b.originalOrder;
      });
  });

  ngOnInit(): void {
    this.projectsService.getProjects().subscribe((projects: Project[]) => {
      if (projects.length === 0) {
        this.toastService.showInfo('No hay proyectos disponibles para mostrar.');
      } else {
        const ordered = projects.map((p, index) => ({ ...p, originalOrder: index }));
        this.projects.set(ordered);
      }
    });
  }

  ngAfterViewInit(): void {
    const grid = this.el.nativeElement.querySelector('.grid');
    if (grid) autoAnimate(grid, { duration: 400, easing: 'ease-in-out' });

    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (!this.isTablet()) {
          this.navbarService.setShowNavbar(entry.isIntersecting);
          return;
        }

        requestAnimationFrame(() => {
          const currentPosition = entry.boundingClientRect.top;
          const scrollDirection = currentPosition < this.lastScrollPosition ? 'down' : 'up';
          this.lastScrollPosition = currentPosition;

          const shouldHide = (
            scrollDirection === 'down' &&
            currentPosition < -30 &&
            !this.isNavbarHidden
          );

          const shouldShow = (
            scrollDirection === 'up' &&
            currentPosition > -15 &&
            this.isNavbarHidden
          );

          if (shouldHide) {
            this.isNavbarHidden = true;
            this.navbarService.setShowNavbar(false);
          } else if (shouldShow) {
            this.isNavbarHidden = false;
            this.navbarService.setShowNavbar(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (this.observerAnchorRef?.nativeElement) {
      this.observer.observe(this.observerAnchorRef.nativeElement);
    }
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  isTablet(): boolean {
    return window.innerWidth >= 768 && window.innerWidth <= 1023;
  }

  @HostListener('window:resize')
  onResize() {
    this.isMobile.set(window.innerWidth <= 767);
  }

  // 👇 ÚNICO MÉTODO MODIFICADO 👇
  setActiveCategory(category: string): void {
    if (this.activeCategory() === category) {
      return;
    }

    // 1. Desconectar el observer para evitar cualquier efecto secundario.
    if (this.observer && this.observerAnchorRef?.nativeElement) {
      this.observer.disconnect();
    }

    // 2. Actualizar la categoría PRIMERO para que Angular empiece a recalcular el DOM.
    this.activeCategory.set(category);
    if (this.isMobile()) {
      this.dropdownOpen.set(false);
    }

    // 3. Esperar al siguiente frame de animación. En este punto, el DOM ya se ha actualizado con el nuevo grid.
    requestAnimationFrame(() => {
      const filtersContainer = this.el.nativeElement.querySelector('.filters-container');
      
      // 4. Y AHORA sí, calculamos la posición correcta y hacemos el scroll.
      if (filtersContainer) {
        window.scrollTo({
          top: filtersContainer.offsetTop,
          behavior: 'auto'
        });
      }

      // 5. Volver a conectar el observer después de que todo se haya estabilizado.
      setTimeout(() => {
        if (this.observer && this.observerAnchorRef?.nativeElement) {
          this.observer.observe(this.observerAnchorRef.nativeElement);
        }
      }, 100);
    });
  }

  toggleDropdown(): void {
    this.dropdownOpen.update(open => !open);
  }
}