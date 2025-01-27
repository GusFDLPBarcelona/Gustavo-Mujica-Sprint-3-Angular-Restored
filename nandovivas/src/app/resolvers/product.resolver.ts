import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ProductsService } from '../services/products.service';
import { Product } from '../interfaces/product';

@Injectable({
  providedIn: 'root',
})
export class ProductResolver implements Resolve<Product | null> {
  constructor(private productsService: ProductsService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Product | null> {
    const id = Number(route.paramMap.get('id'));
    if (!isNaN(id)) {
      return this.productsService.getProductById(id).pipe(
        catchError((error) => {
          console.error('Error al resolver el producto:', error);
          return of(null); // Retorna null en caso de error
        })
      );
    }
    console.error('ID del producto inválido');
    return of(null);
  }
}
