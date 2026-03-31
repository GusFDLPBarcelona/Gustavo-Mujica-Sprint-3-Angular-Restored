import { Component, ElementRef, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { take } from 'rxjs';
import { ProjectsService } from '../../../services/projects.service';
import { WellcomeGalleryService } from '../../../services/wellcome_gallery.service';
import { StorageService } from '../../services/storage.service';

const CATEGORIES = ['Editorial', 'Branding', 'Typography', 'Packaging', 'Illustration', 'Campaign'];

@Component({
  selector: 'app-work-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './work-form.component.html',
  styleUrl: './work-form.component.css'
})
export class WorkFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private projectsService = inject(ProjectsService);
  private galleryService = inject(WellcomeGalleryService);
  private storageService = inject(StorageService);
  private elRef = inject(ElementRef);

  readonly categories = CATEGORIES;

  editId: string | null = null;
  isEditMode = false;
  isLoading = false;
  isSaving = false;

  selectedCategories: string[] = [];

  isCategorySelected(cat: string): boolean {
    return this.selectedCategories.includes(cat);
  }

  toggleCategory(cat: string): void {
    if (this.isCategorySelected(cat)) {
      this.selectedCategories = this.selectedCategories.filter(c => c !== cat);
    } else {
      this.selectedCategories = [...this.selectedCategories, cat];
    }
  }

  // Portada (Work grid)
  coverFile: File | null = null;
  coverPreview = signal<string | null>(null);

  // Portada detalle (project-detail hero)
  detailCoverFile: File | null = null;
  detailCoverPreview = signal<string | null>(null);

  // Imágenes de detalle
  detailFiles: File[] = [];
  detailPreviews = signal<{ url: string; isExisting: boolean }[]>([]);

  form = this.fb.group({
    title:         ['', Validators.required],
    client:        ['', Validators.required],
    originalOrder: [null as number | null],
    description:   [''],
    credits:       [''],
    addToCarousel: [false],
    carouselOrder: [null as number | null],
  });

  ngOnInit() {
    this.editId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.editId;

    if (this.isEditMode && this.editId) {
      this.isLoading = true;
      this.projectsService.getProjectById(this.editId).pipe(take(1)).subscribe(project => {
        if (project) {
          this.form.patchValue({
            title:         project.title,
            client:        project.client,
            originalOrder: project.originalOrder ?? null,
            description:   project.description ?? '',
            credits:       project.credits ?? '',
          });
          // Cargar categorías: nuevo formato o fallback al legacy
          this.selectedCategories = project.categories?.length
            ? [...project.categories]
            : (project.category ? [project.category] : []);
          if (project.image) {
            this.coverPreview.set(project.image);
          }
          if (project.detailImage) {
            this.detailCoverPreview.set(project.detailImage);
          }
          if (project.images?.length) {
            this.detailPreviews.set(project.images.map(url => ({ url, isExisting: true })));
          }
          // Ajustar altura de textareas después de que el DOM refleje los valores
          setTimeout(() => this.resizeAllTextareas(), 0);
        }
        this.isLoading = false;
      });
    }
  }

  autoResize(el: HTMLTextAreaElement) {
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  }

  private resizeAllTextareas() {
    const textareas = this.elRef.nativeElement.querySelectorAll('textarea');
    textareas.forEach((ta: HTMLTextAreaElement) => this.autoResize(ta));
  }

  onCoverSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.coverFile = file;
    const reader = new FileReader();
    reader.onload = () => this.coverPreview.set(reader.result as string);
    reader.readAsDataURL(file);
    input.value = '';
  }

  onDetailCoverSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.detailCoverFile = file;
    const reader = new FileReader();
    reader.onload = () => this.detailCoverPreview.set(reader.result as string);
    reader.readAsDataURL(file);
    input.value = '';
  }

  onDetailFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    if (!files.length) return;
    this.detailFiles.push(...files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        this.detailPreviews.update(prev => [...prev, { url: reader.result as string, isExisting: false }]);
      };
      reader.readAsDataURL(file);
    });
    input.value = '';
  }

  removeDetailImage(index: number) {
    const preview = this.detailPreviews()[index];
    if (!preview.isExisting) {
      // Imagen nueva pendiente de subir — quitarla del array de Files
      const newFileIndex = this.detailPreviews()
        .slice(0, index)
        .filter(p => !p.isExisting).length;
      this.detailFiles.splice(newFileIndex, 1);
    }
    this.detailPreviews.update(prev => prev.filter((_, i) => i !== index));
  }

  async save() {
    if (this.form.invalid) return;
    if (this.selectedCategories.length === 0) {
      alert('Selecciona al menos una categoría.');
      return;
    }
    if (!this.isEditMode && !this.coverFile) {
      alert('Selecciona una imagen de portada.');
      return;
    }
    this.isSaving = true;

    try {
      const projectId = this.editId ?? `tmp_${Date.now()}`;

      // Subir portada si hay archivo nuevo
      let coverUrl = this.coverPreview() ?? '';
      if (this.coverFile) {
        const filename = `${Date.now()}_${this.coverFile.name}`;
        coverUrl = await this.storageService.uploadImage(`projects/${projectId}/cover/${filename}`, this.coverFile);
      }

      // Subir portada de detalle si hay archivo nuevo
      let detailCoverUrl: string | null = null;
      if (this.detailCoverFile) {
        const filename = `${Date.now()}_${this.detailCoverFile.name}`;
        detailCoverUrl = await this.storageService.uploadImage(`projects/${projectId}/detail-cover/${filename}`, this.detailCoverFile);
      }

      // Subir imágenes de detalle nuevas y combinar con las existentes
      const existingUrls = this.detailPreviews()
        .filter(p => p.isExisting)
        .map(p => p.url);

      const newDetailUrls: string[] = [];
      for (const file of this.detailFiles) {
        const filename = `${Date.now()}_${file.name}`;
        const url = await this.storageService.uploadImage(`projects/${projectId}/images/${filename}`, file);
        newDetailUrls.push(url);
      }
      const allDetailUrls = [...existingUrls, ...newDetailUrls];

      const v = this.form.value;
      const data: Record<string, unknown> = {
        title:      v.title!,
        client:     v.client!,
        categories: this.selectedCategories,
        image:      coverUrl,
      };
      if (v.originalOrder != null) data['originalOrder'] = v.originalOrder;
      data['description'] = v.description ?? '';
      data['credits']     = v.credits ?? '';
      data['images'] = allDetailUrls;
      if (detailCoverUrl)          data['detailImage']   = detailCoverUrl;

      if (this.isEditMode && this.editId) {
        await this.projectsService.updateProject(this.editId, data as any);
      } else {
        await this.projectsService.createProject(data as any);
      }

      // Añadir al carousel Welcome si está marcado
      if (v.addToCarousel) {
        const galleryData: Record<string, unknown> = {
          title:      v.title!,
          client:     v.client ?? '',
          image_path: coverUrl,
          mobile_position_x: 50,
        };
        if (v.carouselOrder != null) galleryData['order'] = v.carouselOrder;
        await this.galleryService.addGalleryItem(galleryData as any);
      }

      this.router.navigate(['/haupstadt/work']);
    } catch (err: any) {
      console.error('Error al guardar:', err?.code, err?.message, err);
      alert('Error al guardar. Inténtalo de nuevo.');
    } finally {
      this.isSaving = false;
    }
  }
}
