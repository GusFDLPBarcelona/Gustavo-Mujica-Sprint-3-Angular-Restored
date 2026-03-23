import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { take } from 'rxjs';
import { WellcomeGalleryService } from '../../../services/wellcome_gallery.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-welcome-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './welcome-form.component.html',
  styleUrl: './welcome-form.component.css'
})
export class WelcomeFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private galleryService = inject(WellcomeGalleryService);
  private storageService = inject(StorageService);

  editId: string | null = null;
  isEditMode = false;
  isLoading = false;
  isSaving = false;

  // Archivo seleccionado por el usuario (no forma parte del FormGroup)
  selectedFile: File | null = null;
  // URL para mostrar la preview — puede ser la actual de Firestore o un blob local
  previewUrl = signal<string | null>(null);

  form = this.fb.group({
    title: ['', Validators.required],
    client: [''],
    order: [null as number | null]
  });

  ngOnInit() {
    this.editId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.editId;

    if (this.isEditMode && this.editId) {
      this.isLoading = true;
      // Cargamos el item por ID y rellenamos el formulario
      this.galleryService.getGalleryItemById(this.editId).pipe(take(1)).subscribe(item => {
        if (item) {
          this.form.patchValue({
            title: item.title,
            client: item.client ?? '',
            order: item.order ?? null
          });
          this.previewUrl.set(item.image_path);
        }
        this.isLoading = false;
      });
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.selectedFile = file;
    // Muestra preview local del archivo sin necesidad de subirlo aún
    const reader = new FileReader();
    reader.onload = () => this.previewUrl.set(reader.result as string);
    reader.readAsDataURL(file);
  }

  async save() {
    if (this.form.invalid) return;
    if (!this.isEditMode && !this.selectedFile) {
      alert('Selecciona una imagen.');
      return;
    }
    this.isSaving = true;

    try {
      // Si hay archivo nuevo, se sube a Storage y obtenemos la URL pública
      let imagePath = this.previewUrl() ?? '';
      if (this.selectedFile) {
        const filename = `${Date.now()}_${this.selectedFile.name}`;
        imagePath = await this.storageService.uploadImage(`gallery/${filename}`, this.selectedFile);
      }

      // Solo incluimos 'order' si tiene valor (evitamos guardar null en Firestore)
      const data: Record<string, unknown> = {
        title: this.form.value.title!,
        client: this.form.value.client ?? '',
        image_path: imagePath,
      };
      if (this.form.value.order != null) {
        data['order'] = this.form.value.order;
      }

      if (this.isEditMode && this.editId) {
        await this.galleryService.updateGalleryItem(this.editId, data as any);
      } else {
        await this.galleryService.addGalleryItem(data as any);
      }

      this.router.navigate(['/haupstadt/carousel']);
    } catch (err) {
      console.error(err);
      alert('Error al guardar. Inténtalo de nuevo.');
    } finally {
      this.isSaving = false;
    }
  }
}
