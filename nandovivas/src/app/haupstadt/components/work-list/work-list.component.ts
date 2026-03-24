import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ProjectsService } from '../../../services/projects.service';
import { Project } from '../../../interfaces/project';

@Component({
  selector: 'app-work-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './work-list.component.html',
  styleUrl: './work-list.component.css'
})
export class WorkListComponent {
  private projectsService = inject(ProjectsService);

  confirmingId = signal<string | null>(null);

  items = toSignal(
    this.projectsService.getProjects().pipe(
      map(projects => projects.sort((a, b) => {
        const ao = a.originalOrder ?? Infinity;
        const bo = b.originalOrder ?? Infinity;
        return ao - bo;
      }))
    ),
    { initialValue: [] as Project[] }
  );

  requestDelete(id: string) {
    this.confirmingId.set(id);
  }

  cancelDelete() {
    this.confirmingId.set(null);
  }

  async confirmDelete(id: string) {
    await this.projectsService.deleteProject(id);
    this.confirmingId.set(null);
  }
}
