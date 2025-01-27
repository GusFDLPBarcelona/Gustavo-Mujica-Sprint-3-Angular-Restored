import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductDetail } from '../../interfaces/product-detail';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})

export class ProductDetailComponent implements OnInit {
  product: ProductDetail | null = null; // Producto resuelto
  quantity: number = 1;
  sizes: string[] = [];
  images: string[] = [];

  constructor(private route: ActivatedRoute) {
    console.log('Inicializando el componente de detalle de producto...');
  }

  ngOnInit(): void {
    console.log('Cargando producto en el detalle...');
    this.route.data.subscribe((data) => {
      this.product = data['product'] || { sizes: [], images: [] };
      console.log('Producto cargado en el detalle:', this.product);
    });
  }

  changeMainImage(image: string): void {
    if (this.product?.images) {
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
      // Verifica si todas las tallas tienen stock 0
      return this.product?.sizes?.every((size) => size.stock === 0) || false;
    }
    // Si no tiene tallas, verifica el stock general
    return this.product?.stock === 0;
  }

  selectSize(size: string): void {
    console.log('Talla seleccionada:', size);
    if (this.product) {
      this.product.size = size; // Actualiza la talla seleccionada
    }
  }

  onQuantityChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.quantity = Math.max(1, Number(input.value)); // Garantiza que la cantidad no sea menor a 1
  }

  addToCart(): void {
    console.log('Producto añadido al carrito:', this.product, 'Cantidad:', this.quantity);
  }

  buyNow(): void {
    console.log('Compra inmediata del producto:', this.product, 'Cantidad:', this.quantity);
  }
}
