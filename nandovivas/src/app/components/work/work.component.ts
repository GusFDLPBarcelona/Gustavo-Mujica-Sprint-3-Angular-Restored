import {
  Component,
  OnInit,
  signal,
  computed,
  inject,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProjectsService } from '../../services/projects.service';
import { Project } from '../../interfaces/project';
import { ToastService } from '../../services/toast.service';
import { CommonModule } from '@angular/common';
import autoAnimate from '@formkit/auto-animate';
import gsap from 'gsap';
import Flip from 'gsap/Flip';

@Component({
  selector: 'app-work',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.css']
})
export class WorkComponent implements AfterViewInit, OnInit {
  allProjects = [];
  visibleProjects = [];
  

  constructor(
    private el: ElementRef,
    private projectsService: ProjectsService
  ) {
    console.log('WorkComponent initialized');
  }

  projects = signal<Project[]>([]);
  activeCategory = signal<string>('All');
  isLoading = computed(() => this.projectService.isLoading.value);
  private projectService = inject(ProjectsService);

  ngOnInit() {
    this.projectService.getProjects().subscribe((projects: Project[]) => {
      console.log('Projects:', projects);
      if (projects.length === 0) {
        const toastService = inject(ToastService);
        toastService.showInfo('No hay proyectos disponibles para mostrar.');
      } else {
        const projectsWithOrder = projects.map((project, index) => ({
          ...project,
          originalOrder: index,
        }));
        this.projects.set(projectsWithOrder);
      }
    });
  }

  

  // ✅ CAMBIO AQUÍ: animación con duración más visible
  ngAfterViewInit(): void {
    const grid = this.el.nativeElement.querySelector('.grid');
    if (grid) {
      autoAnimate(grid, {
        duration: 1200,  
        easing: 'ease-in-out cubic-bezier(0.25, 0.8, 0.25, 1)',
      });
    }
  }

  setActiveCategory(category: string) {
    console.log('Categoría activa:', category);
    this.activeCategory.set(category);

    // Animación suave al top
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }
}
