import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild,
  inject,
  signal,
  computed
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

  @ViewChild('observerAnchor') observerAnchorRef!: ElementRef;

  projects = signal<Project[]>([]);
  activeCategory = signal<string>('All');
  isLoading = computed(() => this.projectsService.isLoading.value);
  showNavbar = signal(true);

  filteredProjects = computed(() => {
    const category = this.activeCategory();
    return this.projects()
      .map((project, index) => ({
        ...project,
        matchesFilter: category === 'All' || project.category === category,
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
    // Animación con autoAnimate
    const grid = this.el.nativeElement.querySelector('.grid');
    if (grid) autoAnimate(grid, { duration: 600, easing: 'ease-in-out' });

    // Observador de visibilidad del ancla
    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting;
        this.navbarService.setShowNavbar(isVisible);
      },
      {
        root: null,
        threshold: 0.01
      }
    );

    if (this.observerAnchorRef?.nativeElement) {
      observer.observe(this.observerAnchorRef.nativeElement);
    }
  }

  setActiveCategory(category: string): void {
    if (this.activeCategory() !== category) {
      this.activeCategory.set(category);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
    }
  }
}
