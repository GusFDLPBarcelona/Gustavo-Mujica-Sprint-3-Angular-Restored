import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../interfaces/product';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null; // Producto resuelto
  quantity: number = 1;

  constructor(private route: ActivatedRoute) {
    console.log('inicializando el componente de detalle de producto...');
  }

  ngOnInit(): void {
    console.log('Cargando producto en el detalle...');
    // Obtiene el producto resuelto desde el resolver
    this.route.data.subscribe((data) => {
      this.product = data['product'] || null;
      console.log('Producto cargado en el detalle:', this.product);
    });
  }
  changeMainImage(image: string): void {
    if (this.product?.images) {
      this.product.image = image; // Cambia la imagen principal
    }
  }

get hasAdditionalImages(): boolean {
  return !!(this.product?.images && this.product.images.length > 0);
}

  selectSize(size: string): void {
    if (this.product) {
      this.product.size = size; // Actualiza la talla seleccionada
    }
  }

  addToCart(): void {
    console.log('Producto añadido al carrito:', this.product, 'Cantidad:', this.quantity);
  }

  buyNow(): void {
    console.log('Compra inmediata del producto:', this.product, 'Cantidad:', this.quantity);
  }
}
