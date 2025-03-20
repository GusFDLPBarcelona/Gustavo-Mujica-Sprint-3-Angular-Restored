// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { ProductsService } from '../../services/products.service';
// import { Product } from '../../interfaces/product';
// import { Category } from '../../interfaces/category'; // Asegúrate de crear esta interfaz

// @Component({
//   selector: 'app-haupstadt',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule, FormsModule],
//   templateUrl: './haupstadt.component.html',
//   styleUrls: ['./haupstadt.component.css']
// })
// export class HaupstadtComponent implements OnInit {
//   products: Product[] = [];
//   filteredProducts: Product[] = [];
//   categories: Category[] = [];
//   selectedCategory: string = '';
//   selectedSort: string = 'name';
//   showModal: boolean = false;
//   isEditing: boolean = false;
//   productForm: FormGroup;
//   size: string = '';

//   constructor(
//     private productsService: ProductsService,
//     private fb: FormBuilder
//   ) {
//     this.productForm = this.fb.group({
//       id: [0],
//       name: ['', Validators.required],
//       description: [''],
//       price: [0, [Validators.required, Validators.min(0)]],
//       category: [0, Validators.required],
//       sizes: [[]],
//       colors: [[]],
//       images: ['']
//     });
//   }

//   ngOnInit(): void {
//     this.loadProducts();
//     this.loadCategories();
//   }

//   loadProducts(): void {
//     this.productsService.getProducts().subscribe({
//       next: (products) => {
//         this.products = products;
//         this.filteredProducts = [...products];
//         this.sortProducts(); // Llamada a sortProducts después de cargar los productos
//       },
//       error: (err) => console.error('Error loading products:', err)
//     });
//   }

//   loadCategories(): void {
//     // Implementa la carga real de categorías desde tu servicio
//     this.categories = [
//       { id: 1, name: 'Clothing' },
//       { id: 2, name: 'Accessories' },
//       { id: 3, name: 'Books' },
//       { id: 4, name: 'Prints' }
//     ];
//   }
// // método para agregar tallas y colores
//   addSize(size: string): void {
//     const sizes = this.productForm.get('sizes')?.value || [];
//     if (!sizes.includes(size)) {
//       sizes.push(size);
//       this.productForm.patchValue({ sizes });
//     }
//   }
//   // Método para ordenar productos
//   sortProducts(): void {
//     this.filteredProducts.sort((a, b) => {
//       switch (this.selectedSort) {
//         case 'name':
//           return a.name.localeCompare(b.name);
//         case 'stock':
//           return this.getTotalStock(b) - this.getTotalStock(a);
//         case 'price':
//           return a.price - b.price;
//         case 'category':
//           return a.category.name.localeCompare(b.category.name);
//         default:
//           return 0;
//       }
//     });
//   }

//   getTotalStock(product: Product): number {
//     return product.sizes?.reduce((total, size) => total + size.stock, 0) || 0;
//   }

//   openCreateModal(): void {
//     this.isEditing = false;
//     this.productForm.reset({
//       id: 0,
//       name: '',
//       description: '',
//       price: 0,
//       category: 0,
//       sizes: [],
//       colors: [],
//       images: ''
//     });
//     this.showModal = true;
//   }

//   openEditModal(product: Product): void {
//     this.isEditing = true;
//     this.productForm.patchValue({
//       ...product,
//       category: product.category.id
//     });
//     this.showModal = true;
//   }

//   handleSubmit(): void {
//     if (this.productForm.invalid) return;

//     const formValue = {
//       ...this.productForm.value,
//       category: this.categories.find(c => c.id === this.productForm.value.category)
//     };

//     if (this.isEditing) {
//       this.productsService.updateProduct(formValue.id, formValue).subscribe({
//         next: () => {
//           this.loadProducts();
//           this.closeModal();
//         },
//         error: (err) => console.error('Error updating product:', err)
//       });
//     } else {
//       this.productsService.createProduct(formValue).subscribe({
//         next: () => {
//           this.loadProducts();
//           this.closeModal();
//         },
//         error: (err) => console.error('Error creating product:', err)
//       });
//     }
//   }

//   deleteProduct(id: number): void {
//     if (confirm('¿Estás seguro de eliminar este producto?')) {
//       this.productsService.deleteProduct(id).subscribe({
//         next: () => this.loadProducts(),
//         error: (err) => console.error('Error deleting product:', err)
//       });
//     }
//   }

//   closeModal(): void {
//     this.showModal = false;
//   }

//   filterByCategory(): void {
//     if (this.selectedCategory) {
//       this.filteredProducts = this.products.filter(
//         (product) => product.category?.id === +this.selectedCategory
//       );
//     } else {
//       this.filteredProducts = [...this.products];
//     }
//     this.sortProducts(); // Reordenar después de filtrar
//   }
// }