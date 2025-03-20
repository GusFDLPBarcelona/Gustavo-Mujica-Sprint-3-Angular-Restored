// import { Injectable } from '@angular/core';
// import { Resolve } from '@angular/router';
// import { Observable, of } from 'rxjs';
// import { catchError } from 'rxjs/operators';
// import { ProductsService } from '../services/products.service';
// import { Product } from '../interfaces/product';

// @Injectable({ providedIn: 'root' })
// export class HaupstadtResolver implements Resolve<Product[]> {
//   constructor(private productsService: ProductsService) {}

//   resolve(): Observable<Product[]> {
//     return this.productsService.getProducts().pipe(
//       catchError(() => {
//         console.error('Error al obtener los productos');
//         return of([]); 
//       })
//     );
//   }
// }
