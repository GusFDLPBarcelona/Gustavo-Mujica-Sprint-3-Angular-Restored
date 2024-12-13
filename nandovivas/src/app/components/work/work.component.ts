import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProjectsService } from '../../services/projects.service';
import { Project } from '../../interfaces/project';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-work',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.css']
})
export class WorkComponent implements OnInit {
  projects = signal<Project[]>([]);
  activeCategory = signal<string>('All'); // Inicialización de categoría activa
  isLoading = computed(() => this.projectService.isLoading.value); // Computado para el estado de carga
  private projectService = inject(ProjectsService);

  ngOnInit() {
    this.projectService.getProjects().subscribe((projects: Project[]) => {
      if (projects.length === 0) {
        // Mostrar toast si no hay proyectos
        const toastService = inject(ToastService);
        toastService.showInfo('No hay proyectos disponibles para mostrar.');
      } else {
        this.projects.set(projects);
      }
    });
  }

  setActiveCategory(category: string) {
    this.activeCategory.set(category); // Cambiar la categoría activa
  }

  sortedProjects = computed(() => {
    const category = this.activeCategory(); // Usar categoría activa
    return this.projects().filter((project) =>
      category === 'All' || project.category === category
    );
  });
}
