import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../../../services/products.service';
import { Product, ShopSettings } from '../../../interfaces/product';

@Component({
  selector: 'app-shop-list',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './shop-list.component.html',
  styleUrl: './shop-list.component.css'
})
export class ShopListComponent {
  private productsService = inject(ProductsService);

  confirmingId = signal<string | null>(null);
  newCategoryValue = '';

  items = toSignal(
    this.productsService.getProducts().pipe(
      map(products => products.sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity)))
    ),
    { initialValue: [] as Product[] }
  );

  settings = toSignal(
    this.productsService.getShopSettings(),
    { initialValue: null as ShopSettings | null }
  );

  requestDelete(id: string) {
    this.confirmingId.set(id);
  }

  cancelDelete() {
    this.confirmingId.set(null);
  }

  async confirmDelete(id: string) {
    await this.productsService.deleteProduct(id);
    this.confirmingId.set(null);
  }

  async addCategory() {
    const name = this.newCategoryValue.trim();
    if (!name) return;
    const current = this.settings()?.categories ?? [];
    if (current.includes(name)) return;
    await this.productsService.updateShopSettings({ categories: [...current, name] });
    this.newCategoryValue = '';
  }

  async removeCategory(cat: string) {
    const current = this.settings()?.categories ?? [];
    await this.productsService.updateShopSettings({ categories: current.filter(c => c !== cat) });
  }
}
