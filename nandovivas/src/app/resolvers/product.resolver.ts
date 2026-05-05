import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { ProductsService } from '../services/products.service';
import { Product } from '../interfaces/product';

@Injectable({ providedIn: 'root' })
export class ProductResolver implements Resolve<Product | null> {
  constructor(private productsService: ProductsService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Product | null> {
    const slug = route.paramMap.get('slug');
    if (!slug) return of(null);

    return this.productsService.getProductBySlug(slug).pipe(
      take(1),
      switchMap(product =>
        product ? of(product) : this.productsService.getProductById(slug).pipe(take(1))
      )
    );
  }
}
