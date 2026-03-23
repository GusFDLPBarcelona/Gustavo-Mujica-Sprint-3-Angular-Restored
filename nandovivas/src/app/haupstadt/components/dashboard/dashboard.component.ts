import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ProjectsService } from '../../../services/projects.service';
import { WellcomeGalleryService } from '../../../services/wellcome_gallery.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  private projectsService = inject(ProjectsService);
  private galleryService = inject(WellcomeGalleryService);

  // Conteos reales desde Firestore, actualizados en tiempo real
  projectCount = toSignal(
    this.projectsService.getProjects().pipe(map(p => p.length)),
    { initialValue: 0 }
  );

  carouselCount = toSignal(
    this.galleryService.getGalleryItems().pipe(map(g => g.length)),
    { initialValue: 0 }
  );
}
