import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { WellcomeGalleryService } from '../../../services/wellcome_gallery.service';

@Component({
  selector: 'app-welcome-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './welcome-list.component.html',
  styleUrl: './welcome-list.component.css'
})
export class WelcomeListComponent {
  private galleryService = inject(WellcomeGalleryService);

  // Items ordenados por el campo 'orden' — los que no tienen orden van al final
  items = toSignal(
    this.galleryService.getGalleryItems().pipe(
      map(items => items.sort((a, b) => {
        if (a.order == null && b.order == null) return 0;
        if (a.order == null) return 1;
        if (b.order == null) return -1;
        return a.order - b.order;
      }))
    ),
    { initialValue: [] }
  );

  async delete(id: string) {
    if (!confirm('¿Eliminar esta imagen del carousel?')) return;
    await this.galleryService.deleteGalleryItem(id);
  }
}
