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
  effect,
  ChangeDetectorRef
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
export class WorkComponent implements OnInit, AfterViewInit {
  private el = inject(ElementRef);
  private projectsService = inject(ProjectsService);
  private navbarService = inject(NavbarService);
  private toastService = inject(ToastService);
  private cdRef = inject(ChangeDetectorRef);
  private lastScrollPosition = 0;
  private isNavbarHidden = false;

  
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
    
    if (category && projects.length > 0) {
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
    if (grid) autoAnimate(grid, { duration: 600, easing: 'ease-in-out' });

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!this.isTablet()) {
            this.navbarService.setShowNavbar(entry.isIntersecting);
            return;
          }
    
          requestAnimationFrame(() => {
            const currentPosition = entry.boundingClientRect.top;
            const scrollDirection = currentPosition < this.lastScrollPosition ? 'down' : 'up';
            this.lastScrollPosition = currentPosition;
    
            // Lógica de visibilidad mejorada
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
              debugger;
              this.isNavbarHidden = true;
              this.navbarService.setShowNavbar(false);
            } else if (shouldShow) {
              this.isNavbarHidden = false;
              this.navbarService.setShowNavbar(true);
            }
          });
        },
        
       
      );

    if (this.observerAnchorRef?.nativeElement) {
      observer.observe(this.observerAnchorRef.nativeElement);
    }
  }

  private handleScrollAfterFilter(): void {
    // Opción 1: Usando ViewChild del contenedor
    setTimeout(() => {
      try {
        if (this.gridContainer?.nativeElement) {
          this.gridContainer.nativeElement.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }
        
        
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

  setActiveCategory(category: string): void {
    if (this.activeCategory() !== category) {
      this.activeCategory.set(category);
      this.dropdownOpen.set(false);
      
      // Triple estrategia de seguridad
      setTimeout(() => {
        this.cdRef.detectChanges();
        
        requestAnimationFrame(() => {
          const container = document.querySelector('.work-container');
          container?.scrollTo({ top: 0, behavior: 'smooth' });
          
          setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'auto' });
          }, 100);
        });
      }, 50);
    }
  }

  toggleDropdown(): void {
    this.dropdownOpen.update(open => !open);
  }
}