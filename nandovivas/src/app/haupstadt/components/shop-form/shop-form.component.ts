import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, take } from 'rxjs';
import { ProductsService } from '../../../services/products.service';
import { StorageService } from '../../services/storage.service';
import { ProductColor } from '../../../interfaces/product';

interface SizeEntry { label: string; stock: number; }
interface ColorEntry {
  name: string; hex: string;
  imageUrl: string; imagePreview: string; file: File | null;
  stock: number; sizes: SizeEntry[];
}

@Component({
  selector: 'app-shop-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './shop-form.component.html',
  styleUrl: './shop-form.component.css'
})
export class ShopFormComponent implements OnInit {
  private fb             = inject(FormBuilder);
  private route          = inject(ActivatedRoute);
  private router         = inject(Router);
  private productsService = inject(ProductsService);
  private storageService  = inject(StorageService);

  @ViewChild('descEditor') descEditorRef!: ElementRef<HTMLDivElement>;

  editId: string | null = null;
  isEditMode   = false;
  isLoading    = false;
  isSaving     = false;
  confirmingDelete = false;

  slugManuallyEdited = false;
  slugConflict   = signal<string | null>(null);
  isCheckingSlug = signal(false);
  private slugCheckTimeout: any = null;

  categories = toSignal(
    this.productsService.getShopSettings().pipe(map(s => s?.categories ?? [])),
    { initialValue: [] as string[] }
  );

  coverFile    : File | null = null;
  coverPreview = signal<string | null>(null);

  galleryFiles    : File[] = [];
  galleryPreviews = signal<{ url: string; isExisting: boolean }[]>([]);

  sizes : SizeEntry[]  = [];
  colors: ColorEntry[] = [];

  form = this.fb.group({
    name:        ['', Validators.required],
    slug:        [''],
    price:       [null as number | null, [Validators.required, Validators.min(0)]],
    category:    [''],
    order:       [null as number | null],
    active:      [true],
    hasSizes:    [false],
    hasColors:   [false],
    stock:       [null as number | null],
    altText:     [''],
    description: [''],
  });

  get hasSizes():  boolean { return !!this.form.get('hasSizes')?.value;  }
  get hasColors(): boolean { return !!this.form.get('hasColors')?.value; }

  ngOnInit() {
    this.editId     = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.editId;

    this.form.get('name')!.valueChanges.subscribe(name => {
      if (!this.slugManuallyEdited) {
        const generated = ProductsService.generateSlug(name ?? '');
        this.form.get('slug')!.setValue(generated, { emitEvent: false });
        this.scheduleSlugCheck(generated);
      }
    });

    if (this.isEditMode && this.editId) {
      this.isLoading = true;
      this.productsService.getProductById(this.editId).pipe(take(1)).subscribe(product => {
        if (product) {
          this.form.patchValue({
            name:        product.name,
            slug:        product.slug ?? '',
            price:       product.price,
            category:    product.category,
            order:       product.order ?? null,
            active:      product.active,
            hasSizes:    product.hasSizes,
            hasColors:   product.hasColors,
            stock:       product.stock ?? null,
            altText:     product.altText ?? '',
            description: product.description ?? '',
          });
          if (product.slug) {
            this.slugManuallyEdited = true;
            this.scheduleSlugCheck(product.slug);
          }
          if (product.image) this.coverPreview.set(product.image);
          if (product.images?.length) {
            this.galleryPreviews.set(product.images.map(url => ({ url, isExisting: true })));
          }
          if (product.sizes?.length) {
            this.sizes = product.sizes.map(s => ({ label: s.label, stock: s.stock }));
          }
          if (product.colors?.length) {
            this.colors = product.colors.map(c => ({
              name: c.name, hex: c.hex ?? '#000000',
              imageUrl: c.image, imagePreview: c.image, file: null,
              stock: c.stock ?? 0,
              sizes: (c.sizes ?? []).map(s => ({ label: s.label, stock: s.stock })),
            }));
          }
          setTimeout(() => {
            if (this.descEditorRef) {
              this.descEditorRef.nativeElement.innerHTML = this.toEditorHtml(product.description ?? '');
            }
          }, 0);
        }
        this.isLoading = false;
      });
    }
  }

  onSlugInput(value: string): void {
    this.slugManuallyEdited = true;
    this.scheduleSlugCheck(value);
  }

  private scheduleSlugCheck(slug: string): void {
    clearTimeout(this.slugCheckTimeout);
    this.slugConflict.set(null);
    if (!slug) { this.isCheckingSlug.set(false); return; }
    this.isCheckingSlug.set(true);
    this.slugCheckTimeout = setTimeout(async () => {
      const conflict = await this.productsService.checkSlugExists(slug, this.editId ?? undefined);
      this.slugConflict.set(conflict);
      this.isCheckingSlug.set(false);
    }, 500);
  }

  private toEditorHtml(text: string): string {
    if (/<[a-z][\s\S]*>/i.test(text)) return text;
    return text.split(/\n\n+/).map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
  }

  format(event: MouseEvent, command: string): void {
    event.preventDefault();
    document.execCommand(command, false);
  }

  onCoverSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.coverFile = file;
    const reader = new FileReader();
    reader.onload = () => this.coverPreview.set(reader.result as string);
    reader.readAsDataURL(file);
    (event.target as HTMLInputElement).value = '';
  }

  onGallerySelected(event: Event) {
    const files = Array.from((event.target as HTMLInputElement).files ?? []);
    if (!files.length) return;
    this.galleryFiles.push(...files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => this.galleryPreviews.update(p => [...p, { url: reader.result as string, isExisting: false }]);
      reader.readAsDataURL(file);
    });
    (event.target as HTMLInputElement).value = '';
  }

  removeGalleryImage(index: number) {
    const preview = this.galleryPreviews()[index];
    if (!preview.isExisting) {
      const newFileIdx = this.galleryPreviews().slice(0, index).filter(p => !p.isExisting).length;
      this.galleryFiles.splice(newFileIdx, 1);
    }
    this.galleryPreviews.update(p => p.filter((_, i) => i !== index));
  }

  addSize()             { this.sizes = [...this.sizes, { label: '', stock: 0 }]; }
  removeSize(i: number) { this.sizes = this.sizes.filter((_, idx) => idx !== i); }

  addColor() {
    this.colors = [...this.colors, {
      name: '', hex: '#000000', imageUrl: '', imagePreview: '', file: null, stock: 0, sizes: [],
    }];
  }
  removeColor(i: number) { this.colors = this.colors.filter((_, idx) => idx !== i); }

  onColorImageSelected(event: Event, ci: number) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.colors[ci] = { ...this.colors[ci], file };
    const reader = new FileReader();
    reader.onload = () => {
      this.colors[ci] = { ...this.colors[ci], imagePreview: reader.result as string };
      this.colors = [...this.colors];
    };
    reader.readAsDataURL(file);
    (event.target as HTMLInputElement).value = '';
  }

  addSizeToColor(ci: number) {
    this.colors[ci] = { ...this.colors[ci], sizes: [...this.colors[ci].sizes, { label: '', stock: 0 }] };
    this.colors = [...this.colors];
  }
  removeSizeFromColor(ci: number, si: number) {
    this.colors[ci] = { ...this.colors[ci], sizes: this.colors[ci].sizes.filter((_, i) => i !== si) };
    this.colors = [...this.colors];
  }

  requestDelete()  { this.confirmingDelete = true;  }
  cancelDelete()   { this.confirmingDelete = false; }
  async confirmDelete() {
    if (!this.editId) return;
    await this.productsService.deleteProduct(this.editId);
    this.router.navigate(['/haupstadt/shop']);
  }

  async save() {
    if (this.form.invalid) return;
    if (this.slugConflict()) { alert('El slug ya está en uso. Edítalo antes de guardar.'); return; }
    if (!this.isEditMode && !this.coverFile) { alert('Selecciona una imagen de portada.'); return; }

    this.isSaving = true;
    try {
      const productId = this.editId ?? `tmp_${Date.now()}`;

      let coverUrl = this.coverPreview() ?? '';
      if (this.coverFile) {
        coverUrl = await this.storageService.uploadImage(
          `products/${productId}/cover/${Date.now()}_${this.coverFile.name}`, this.coverFile
        );
      }

      const existingGallery = this.galleryPreviews().filter(p => p.isExisting).map(p => p.url);
      const newGallery: string[] = [];
      for (const file of this.galleryFiles) {
        const url = await this.storageService.uploadImage(
          `products/${productId}/gallery/${Date.now()}_${file.name}`, file
        );
        newGallery.push(url);
      }

      const colorsData: ProductColor[] = [];
      if (this.hasColors) {
        for (let i = 0; i < this.colors.length; i++) {
          const c = this.colors[i];
          let imageUrl = c.imageUrl;
          if (c.file) {
            imageUrl = await this.storageService.uploadImage(
              `products/${productId}/colors/${i}_${Date.now()}_${c.file.name}`, c.file
            );
          }
          const entry: ProductColor = { name: c.name, hex: c.hex, image: imageUrl };
          if (this.hasSizes) {
            entry.sizes = c.sizes.map(s => ({ label: s.label, stock: s.stock }));
          } else {
            entry.stock = c.stock;
          }
          colorsData.push(entry);
        }
      }

      const v = this.form.value;
      const data: any = {
        name:        v.name!,
        slug:        v.slug ?? '',
        price:       Number(v.price!),
        category:    v.category ?? '',
        active:      v.active ?? true,
        image:       coverUrl,
        images:      [...existingGallery, ...newGallery],
        altText:     v.altText ?? '',
        hasSizes:    v.hasSizes ?? false,
        hasColors:   v.hasColors ?? false,
        description: v.description ?? '',
      };
      if (v.order != null) data['order'] = v.order;

      if (!this.hasSizes && !this.hasColors) {
        data['stock'] = v.stock ?? 0;
      } else if (this.hasSizes && !this.hasColors) {
        data['sizes'] = this.sizes.map(s => ({ label: s.label, stock: s.stock }));
      } else {
        data['colors'] = colorsData;
      }

      if (this.isEditMode && this.editId) {
        await this.productsService.updateProduct(this.editId, data);
      } else {
        await this.productsService.createProduct(data);
      }

      this.router.navigate(['/haupstadt/shop']);
    } catch (err: any) {
      console.error('Error al guardar:', err);
      alert('Error al guardar. Inténtalo de nuevo.');
    } finally {
      this.isSaving = false;
    }
  }
}
