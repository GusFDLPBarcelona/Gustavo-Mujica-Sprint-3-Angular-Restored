import { Component, inject, signal } from '@angular/core';
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

  projectCount = toSignal(
    this.projectsService.getProjects().pipe(map(p => p.length)),
    { initialValue: 0 }
  );

  carouselCount = toSignal(
    this.galleryService.getGalleryItems().pipe(map(g => g.length)),
    { initialValue: 0 }
  );

  isMigratingSlugs = false;
  slugMigrationResult = signal<string | null>(null);

  async runSlugMigration() {
    if (this.isMigratingSlugs) return;
    this.isMigratingSlugs = true;
    this.slugMigrationResult.set(null);
    try {
      const count = await this.projectsService.migrateSlugs();
      this.slugMigrationResult.set(
        count > 0
          ? `✓ Migración completada: ${count} proyecto${count !== 1 ? 's' : ''} actualizado${count !== 1 ? 's' : ''}.`
          : '✓ Todos los proyectos ya tienen slug. No fue necesario migrar.'
      );
    } catch (err) {
      this.slugMigrationResult.set('✗ Error durante la migración. Revisa la consola.');
      console.error(err);
    } finally {
      this.isMigratingSlugs = false;
    }
  }

}
