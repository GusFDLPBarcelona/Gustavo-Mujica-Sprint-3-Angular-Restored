import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild,
  inject,
  signal,
  computed,
  HostListener
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProjectsService } from '../../services/projects.service';
import { Project } from '../../interfaces/project';
import { ToastService } from '../../services/toast.service';
import { CommonModule } from '@angular/common';
import autoAnimate from '@formkit/auto-animate';
import { NgZone } from '@angular/core';
import { take } from 'rxjs';

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
  private toastService = inject(ToastService);

  constructor(private ngZone: NgZone) { }

  @ViewChild('gridContainer', { read: ElementRef }) gridContainer!: ElementRef;

  projects = signal<Project[]>([]);
  activeCategory = signal<string>('All');
  isLoading = computed(() => this.projectsService.isLoading.value);

  isMobile = signal(window.innerWidth <= 767);
  dropdownOpen = signal(false);
  categories = ['All','Editorial', 'Branding', 'Typography', 'Packaging', 'Illustration', 'Web & SM'];

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
  }


  @HostListener('window:resize')
  onResize() {
    this.isMobile.set(window.innerWidth <= 767);
  }

  setActiveCategory(category: string): void {
    this.activeCategory.set(category);
    this.dropdownOpen.set(false);

    // Espera a que Angular termine de pintar y luego deja que el navegador haga el offset
    this.ngZone.onStable.pipe(take(1)).subscribe(() => {
      this.scrollGridIntoViewAfterRender();
    });
  }

categorySelected = signal(false);

  setActiveCategoryAndClose(category: string, dropdown: HTMLDetailsElement): void {
    this.setActiveCategory(category);
    this.categorySelected.set(true);
    dropdown.open = false;
  }

  /** Calcula el offset real de barras fijas y hace scroll con scroll-margin-top. */
  private scrollGridIntoViewAfterRender(): void {
    const gridEl: HTMLElement | null = this.gridContainer?.nativeElement ?? null;
    if (!gridEl) return;
  
    // Solo hacer scroll automático en desktop/tablet
    if (window.innerWidth > 767) {
      const offset = this.computeStickyOffset();
      gridEl.style.scrollMarginTop = `${offset}px`;
  
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          gridEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      });
    }
  }

  /** Lee el DOM para sumar alturas visibles de cabeceras fijas. */
       private computeStickyOffset(): number {
      const getVisibleHeight = (selector: string) => {
        const el = document.querySelector<HTMLElement>(selector);
        if (!el) return 0;
        const style = window.getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden') return 0;
        const rect = el.getBoundingClientRect();
        return rect.height > 0 ? rect.height : 0;
      };
    
      const isMobile = window.innerWidth <= 767;
    
      const navbarHeight = getVisibleHeight('.filters-container'); // navbar fija
      let filtersHeight = 0;
    
      if (isMobile) {
        filtersHeight = getVisibleHeight('.filters-dropdown > summary'); // SOLO summary
      } else {
        filtersHeight = getVisibleHeight('.filters-horizontal');
      }
    
      return Math.round(navbarHeight + filtersHeight);
    }


  toggleDropdown(): void {
    this.dropdownOpen.update(open => !open);
  }
}

