import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { WellcomeGalleryService } from '../../../services/wellcome_gallery.service';
import { WellcomeGallery } from '../../../interfaces/wellcome_gallery';

@Component({
  selector: 'app-welcome-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './welcome-list.component.html',
  styleUrl: './welcome-list.component.css'
})
export class WelcomeListComponent {
  private galleryService = inject(WellcomeGalleryService);

  // ID de la card que está esperando confirmación de borrado
  confirmingId = signal<string | null>(null);

  items = toSignal(
    this.galleryService.getGalleryItems().pipe(
      map(items => items.sort((a, b) => {
        if (a.order == null && b.order == null) return 0;
        if (a.order == null) return 1;
        if (b.order == null) return -1;
        return a.order - b.order;
      }))
    ),
    { initialValue: [] as WellcomeGallery[] }
  );

  requestDelete(id: string) {
    this.confirmingId.set(id);
  }

  cancelDelete() {
    this.confirmingId.set(null);
  }

  async confirmDelete(id: string) {
    await this.galleryService.deleteGalleryItem(id);
    this.confirmingId.set(null);
  }
}
