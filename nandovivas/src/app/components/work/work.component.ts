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

  // Efecto para manejar el scroll después de filtrar
  private scrollEffect = effect(() => {
    const category = this.activeCategory();
    const projects = this.filteredProjects();
    
    // Solo hacer scroll si no es la categoría inicial 'All' y hay proyectos
    if (category && category !== 'All' && projects.length > 0) {
      this.handleScrollAfterFilter();
    }
  });

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
    // Asegurar que la navbar esté visible al entrar al componente
    this.navbarService.setShowNavbar(true);
    
    // Scroll inicial al entrar al componente - completamente arriba para mostrar navbar
    setTimeout(() => {
      document.documentElement.scrollTo({
        top: 0,
        behavior: 'auto'
      });
    }, 0);

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

  private handleScrollAfterFilter(): void {
    // Hacer scroll en el elemento HTML principal ya que body tiene overflow-y: hidden
    setTimeout(() => {
      try {
        // Intentar scroll en document.documentElement (html) - posición que no muestre navbar
        document.documentElement.scrollTo({
          top: 100,
          behavior: 'smooth'
        });
        
        // Fallback: scroll en body si el anterior no funciona - misma posición
        setTimeout(() => {
          document.body.scrollTo({
            top: 100,
            behavior: 'smooth'
          });
        }, 100);
        
      } catch (error) {
        console.warn('Error en scroll:', error);
      }
    }, 50);
 
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
    if (this.activeCategory() !== category) {
      this.activeCategory.set(category);
      this.dropdownOpen.set(false);
      // El scroll se maneja automáticamente en handleScrollAfterFilter() via effect
    }
  }

  toggleDropdown(): void {
    this.dropdownOpen.update(open => !open);
  }
}