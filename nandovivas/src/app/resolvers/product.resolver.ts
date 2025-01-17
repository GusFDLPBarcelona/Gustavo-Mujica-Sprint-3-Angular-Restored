import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ProductsService } from '../services/products.service';
import { Product } from '../interfaces/product';

@Injectable({
  providedIn: 'root'
})
export class ProductResolver implements Resolve<Product | null> {
  constructor(private productsService: ProductsService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Product | null> {
    const id = route.paramMap.get('id'); // Obtiene el parámetro 'id' de la URL
    if (!id) {
      return of(null); // Si no hay ID, retorna null
    }
    return this.productsService.getProductById(Number(id)); // Llama al método del servicio
  }
}
