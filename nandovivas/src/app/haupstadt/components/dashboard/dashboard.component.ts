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

  migrateStatus = signal<'idle' | 'confirm' | 'running' | 'done'>('idle');
  migratedCount = signal(0);

  startMigration() { this.migrateStatus.set('confirm'); }
  cancelMigration() { this.migrateStatus.set('idle'); }

  async confirmMigration() {
    this.migrateStatus.set('running');
    try {
      const count = await this.projectsService.migrateCategories();
      this.migratedCount.set(count);
      this.migrateStatus.set('done');
    } catch {
      this.migrateStatus.set('idle');
      alert('Error en la migración. Inténtalo de nuevo.');
    }
  }
}
