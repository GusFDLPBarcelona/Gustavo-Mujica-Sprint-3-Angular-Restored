import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProjectsService } from '../../services/projects.service';
import { Project } from '../../interfaces/project';
import { ToastService } from '../../services/toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-work',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.css']
})
export class WorkComponent implements OnInit {
  constructor() {
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

  setActiveCategory(category: string) {
    console.log('Categoría activa:', category);
    this.activeCategory.set(category); // Cambiar la categoría activa
    console.log('ScrollTop del body:', document.body.scrollTop);
    console.log('ScrollTop del html:', document.documentElement.scrollTop);
    // Animación suave al top
    document.body.scrollTop= 0;
    document.documentElement.scrollTop = 0;}
  
  
  
}