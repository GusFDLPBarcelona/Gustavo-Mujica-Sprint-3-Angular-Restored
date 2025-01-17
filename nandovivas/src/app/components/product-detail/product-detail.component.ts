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

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Obtiene el producto resuelto desde el resolver
    this.route.data.subscribe((data) => {
      this.product = data['product'];
      console.log('Producto cargado en el detalle:', this.product);
    });
  }
}
