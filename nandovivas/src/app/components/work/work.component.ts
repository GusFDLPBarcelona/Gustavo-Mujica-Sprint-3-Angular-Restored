import { Component, OnInit } from '@angular/core';
import { ProjectsService } from '../../services/projects.service';
import { Project } from '../../interfaces/project';

@Component({
  selector: 'app-work',
  standalone: true,
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.css'], // Nota: 'styleUrls', no 'styleUrl'
})
export class WorkComponent implements OnInit {
  projects: Project[] = []; // Todos los proyectos
  displayedProjects: Project[] = []; // Proyectos visibles
  // Categorías predefinidas como respaldo
  categories: string[] = ['All', 'Editorial', 'Branding', 'Typography', 'Packaging', 'Illustration', 'Web & SM'];
  selectedCategory: string = 'All'; // Categoría seleccionada

  constructor(private projectsService: ProjectsService) {}

  ngOnInit(): void {
    // Cargar proyectos desde el servicio
    this.projectsService.getProjects().subscribe((data) => {
      this.projects = data;
      this.displayedProjects = [...this.projects]; // Mostrar todos inicialmente
      this.extractCategories(); // Sobrescribe las categorías dinámicamente si hay datos
    });
  }

  /**
   * Extrae las categorías únicas de los proyectos cargados.
   * Si no hay proyectos, mantiene las categorías predefinidas.
   */
  private extractCategories(): void {
    if (this.projects.length > 0) {
      const allCategories = this.projects.map((project) => project.category);
      this.categories = ['All', ...Array.from(new Set(allCategories))];
    }
  }

  /**
   * Maneja el filtro de proyectos según la categoría seleccionada.
   * @param category Categoría seleccionada por el usuario
   */
  filterByCategory(category: string): void {
    this.selectedCategory = category;
    if (category === 'All') {
      this.displayedProjects = [...this.projects]; // Restaurar todos los proyectos
    } else {
      this.displayedProjects = this.projects.filter(
        (project) => project.category === category
      );
    }
  }

  /**
   * Verifica si un proyecto pertenece a la categoría seleccionada.
   * @param project Proyecto a verificar
   */
  isTransparent(project: Project): boolean {
    return (
      this.selectedCategory !== 'All' &&
      project.category !== this.selectedCategory
    );
  }
}
