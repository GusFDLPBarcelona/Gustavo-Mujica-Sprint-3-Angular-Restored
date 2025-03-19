import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ProductsService } from '../services/products.service';
import { Product } from '../interfaces/product';

@Injectable({ providedIn: 'root' })
export class ProductResolver implements Resolve<Product | null> {
  constructor(private productsService: ProductsService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Product | null> {
    const idParam = route.paramMap.get('id');
    
    if (!idParam || isNaN(+idParam)) {
      console.error('ID inválido');
      return of(null); 
    }

    return this.productsService.getProductById(+idParam).pipe(
      catchError(() => {
        return of(null); 
      })
    );
  }
}