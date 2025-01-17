import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Product } from '../interfaces/product';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private apiUrl = 'http://localhost:4000/api/products'; // URL de la API para productos
  private cache: Product[] | null = null; // Caché local de productos
  public isLoading = new BehaviorSubject<boolean>(false); // Estado de carga

  constructor(private http: HttpClient, private toastService: ToastService) {}

  // Obtener todos los productos
  getProducts(): Observable<Product[]> {
    this.isLoading.next(true);

    return this.http.get<Product[]>(this.apiUrl).pipe(
      tap((products) => {
        this.cache = products; // Guardar productos en caché si se obtienen desde el backend
        this.isLoading.next(false);
      }),
      catchError((error) => {
        console.error('Error al cargar productos desde la API:', error);

        if (this.cache) {
          console.warn('Cargando productos desde la caché.');
          this.isLoading.next(false);
          return of(this.cache); // Retornar caché si existe
        }

        this.toastService.showError('Error al cargar productos. Intenta más tarde.');
        this.isLoading.next(false);
        return of([]); // Retornar lista vacía si no hay caché
      })
    );
  }

  // Obtener imágenes de los productos
  getProductImages(): Observable<string[]> {
    return this.http.get<Product[]>(this.apiUrl).pipe(
      map((products) => products.map((product) => product.image)), // Extraer URLs de las imágenes
      catchError((error) => {
        console.error('Error al cargar imágenes de productos:', error);
        this.toastService.showError('Error al cargar imágenes de productos.');
        return of([]); // Retornar lista vacía en caso de error
      })
    );
  }

  // Obtener un producto por su ID
  getProductById(id: number): Observable<Product | null> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
      catchError(() => {
        this.toastService.showError('No se pudo cargar el producto.');
        return of(null); // Retornar `null` en caso de error
      })
    );
  }

  // Crear un nuevo producto
  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product).pipe(
      tap(() => {
        this.toastService.showSuccess('Producto creado con éxito.');
      }),
      catchError((error) => {
        console.error('Error al crear producto:', error);
        this.toastService.showError('No se pudo crear el producto. Intenta más tarde.');
        return of(product); // Retornar el producto enviado en caso de error
      })
    );
  }

  // Actualizar un producto existente
  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product).pipe(
      tap(() => {
        this.toastService.showSuccess('Producto actualizado con éxito.');
      }),
      catchError((error) => {
        console.error('Error al actualizar producto:', error);
        this.toastService.showError('No se pudo actualizar el producto. Intenta más tarde.');
        return of(product); // Retornar el producto enviado en caso de error
      })
    );
  }

  // Eliminar un producto
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.toastService.showSuccess('Producto eliminado con éxito.');
      }),
      catchError((error) => {
        console.error('Error al eliminar producto:', error);
        this.toastService.showError('No se pudo eliminar el producto. Intenta más tarde.');
        return of(undefined); // Retornar `undefined` en caso de error
      })
    );
  }
}
