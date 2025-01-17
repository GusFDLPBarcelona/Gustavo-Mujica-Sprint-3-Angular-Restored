import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../interfaces/product';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css'],
})
export class ShopComponent implements OnInit {
  products: Product[] = [];
  activeCategory = 'All'; // Categoría activa
  filteredProducts: Product[] = [];

  constructor(private productsService: ProductsService) {
    console.log('ShopComponent initialized');
  }

  ngOnInit(): void {
    this.loadProducts(); // Cargar productos al inicializar el componente
  }

  // Método para cargar productos
  loadProducts(): void {
    this.productsService.getProducts().subscribe({
      next: (data: Product[]) => {
        console.log('Productos cargados:', data);
        console.log('Datos del producto:', this.products);
        
        this.products = data.map((product, index) => ({
          ...product,
          originalOrder: index, // Agregar el orden original para ordenar correctamente
        }));
        console.log('Productos filtrados:', this.filteredProducts);
        this.filteredProducts = this.products;

        console.log('Productos cargados:', this.products);
        console.log('Productos filtrados:', this.filteredProducts);
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
      },
      complete: () => {
        console.log('Carga de productos completada.');
      },
    });
  }
  
  setActiveCategory(category: string): void {
    console.log('Categoría activa:', category);
    this.activeCategory = category;
  
    // Filtro por categoría (normalizando a minúsculas)
    this.filteredProducts = category === 'All'
      ? this.products
      : this.products.filter((product) =>
          product.category?.toLowerCase() === category.toLowerCase()
        );
  
    console.log('Productos filtrados:', this.filteredProducts);
  }
  
  
  
}
