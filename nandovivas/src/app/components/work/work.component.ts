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
  Injector,
  afterNextRender
} from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ProjectsService } from '../../services/projects.service';
import { Project } from '../../interfaces/project';
import { ToastService } from '../../services/toast.service';
import { CommonModule } from '@angular/common';
import autoAnimate from '@formkit/auto-animate';

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
  private injector = inject(Injector);
  private route = inject(ActivatedRoute);

  @ViewChild('gridContainer', { read: ElementRef }) gridContainer!: ElementRef;

  projects = signal<Project[]>([]);
  activeCategory = signal<string>('All');

  isMobile = signal(window.innerWidth <= 767);
  dropdownOpen = signal(false);
  categories = ['All','Editorial', 'Branding', 'Typography', 'Packaging', 'Illustration', 'Web & SM'];

  filteredProjects = computed(() => {
    const category = this.activeCategory();
    return this.projects()
      .map((project) => ({
        ...project,
        matchesFilter: project.category === category,
      }))
      .sort((a, b) => {
        if (a.matchesFilter && !b.matchesFilter) return -1;
        if (!a.matchesFilter && b.matchesFilter) return 1;
        return (a.originalOrder ?? 9999) - (b.originalOrder ?? 9999);
      });
  });


  ngOnInit(): void {
    const categoryParam = this.route.snapshot.queryParamMap.get('category');
    if (categoryParam && this.categories.includes(categoryParam)) {
      this.activeCategory.set(categoryParam);
    }

    this.projectsService.getProjects().subscribe({
      next: (projects: Project[]) => {
        if (projects.length === 0) {
          this.toastService.showInfo('No hay proyectos disponibles para mostrar.');
        } else {
          const ordered = [...projects].sort((a, b) => (a.originalOrder ?? 9999) - (b.originalOrder ?? 9999));
          this.projects.set(ordered);
        }
      },
      error: () => {
        this.toastService.showError('Error al cargar proyectos. Intenta más tarde.');
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

    afterNextRender(() => {
      this.scrollGridIntoViewAfterRender();
    }, { injector: this.injector });
  }

  private scrollGridIntoViewAfterRender(): void {
    const gridEl: HTMLElement | null = this.gridContainer?.nativeElement ?? null;
    if (!gridEl) return;

    const offset = this.computeStickyOffset();
    gridEl.style.scrollMarginTop = `${offset}px`;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        gridEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

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
    const navbarHeight = getVisibleHeight('.filters-container');
    const filtersHeight = isMobile ? getVisibleHeight('.filters-dropdown') : getVisibleHeight('.filters-horizontal');

    return Math.round(navbarHeight + filtersHeight);
  }

  categorySelected = signal(false);

  setActiveCategoryAndClose(category: string, dropdown: HTMLDetailsElement): void {
    this.setActiveCategory(category);
    this.categorySelected.set(true);
    dropdown.open = false;
  }

  toggleDropdown(): void {
    this.dropdownOpen.update(open => !open);
  }
}
