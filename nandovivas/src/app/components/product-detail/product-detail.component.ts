import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../interfaces/product';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule], // 🔥 Necesario para directivas estructurales
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush // 🔥 Optimización de rendimiento
})
export class ProductDetailComponent implements OnInit {
  product: Product = { 
    id: 0, 
    name: '', 
    description: '', 
    price: 0, 
    stock: 0, 
    image: '', 
    images: [], 
    sizes: [],
    colors: [], // 🔥 Inicialización adicional
    categories: [],
  };
  quantity: number = 1;

  constructor(private route: ActivatedRoute) {
    console.log('Inicializando el componente de detalle de producto...');
  }

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.product = data['product'] || { 
        sizes: [], 
        images: [], 
        colors: [] // 🔥 Inicialización segura
      };
    });
  }

  changeMainImage(image: string): void {
    if (this.product) {
      this.product.image = image; // Cambia la imagen principal
    }
  }

  get hasAdditionalImages(): boolean {
    console.log('Verificando si el producto tiene imágenes adicionales...');
    return !!(this.product?.images && this.product.images.length > 0);
  }

  get hasSizes(): boolean {
    return !!(this.product?.sizes && this.product.sizes.length > 0);
  }

  get isOutOfStock(): boolean {
    if (this.hasSizes) {
      const selectedSize = this.product.sizes?.find(s => s.selected);
      return selectedSize ? selectedSize.stock === 0 : true;
    }
    return this.product?.stock === 0;
  }
  selectSize(size: string): void {
    this.product.sizes = this.product.sizes?.map(s => ({
      ...s,
      selected: s.size === size
    })) || [];
  }

  onQuantityChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.quantity = Math.max(1, Number(input.value)); // Evita valores menores a 1
  }

  addToCart(): void {
    console.log('Producto añadido al carrito:', this.product, 'Cantidad:', this.quantity);
  }

  buyNow(): void {
    console.log('Compra inmediata del producto:', this.product, 'Cantidad:', this.quantity);
  }
}
