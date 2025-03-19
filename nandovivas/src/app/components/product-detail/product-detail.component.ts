import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../interfaces/product';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../services/products.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent implements OnInit {
  product: Product = {
    id: 0,
    name: '',
    description: '',
    image: '',
    price: 0,
    sizes: [],
    colors: [],
    images: [],
    category: {
      id: 0, name: '',
      toLowerCase: function (): unknown {
        throw new Error('Function not implemented.');
      }
    },
  };
  quantity: number = 1;
  selectedSize: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.params['id'];
    this.productsService.getProductById(+productId).subscribe((product) => {
      if (product) {
        this.product = {
          ...product,
          sizes: product.sizes.map((size) => ({
            ...size,
            selected: false, // Inicializar selección
          })),
        };
      }
    });
  }

  // Cambiar imagen principal
  changeMainImage(newImage: string): void {
    this.product.image = newImage;
  }

  // Verificar si hay imágenes adicionales
  get hasAdditionalImages(): boolean {
    return !!(this.product.images && this.product.images.length > 0);
  }

  // Verificar si el producto tiene tallas
  get hasSizes(): boolean {
    return !!(this.product.sizes && this.product.sizes.length > 0);
  }

  // Verificar si el producto está agotado
  get isOutOfStock(): boolean {
    if (this.hasSizes) {
      const selectedSize = this.product.sizes.find((s) => s.selected);
      return selectedSize ? selectedSize.stock === 0 : false;
    }
    return false; // Si no hay tallas, asumimos stock infinito
  }

  // Seleccionar talla
  selectSize(size: string | null): void {
    this.selectedSize = size;
    this.product.sizes = this.product.sizes.map((s) => ({
      ...s,
      selected: s.size === size,
    }));
  }

  // Cambiar cantidad
  onQuantityChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.quantity = Math.max(1, Number(input.value)); // Evita valores menores a 1
  }

  getMaxQuantity(): number {
    if (!this.hasSizes) return 100;
    const selectedSize = this.product.sizes.find(s => s.selected);
    return selectedSize ? selectedSize.stock : 0;
  }

  // Añadir al carrito
  addToCart(): void {
    if (this.isOutOfStock) {
      console.warn('No se puede añadir al carrito: Producto agotado.');
      return;
    }
    console.log('Añadido al carrito:', {
      product: this.product,
      quantity: this.quantity,
      selectedSize: this.selectedSize,
    });
  }

  // Comprar ahora
  buyNow(): void {
    if (this.isOutOfStock) {
      console.warn('No se puede comprar: Producto agotado.');
      return;
    }
    console.log('Compra inmediata:', {
      product: this.product,
      quantity: this.quantity,
      selectedSize: this.selectedSize,
    });
  }
}