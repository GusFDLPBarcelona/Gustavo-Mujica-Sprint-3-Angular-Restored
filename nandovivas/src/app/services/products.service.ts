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
  private apiUrl = 'http://localhost:4000/api/products';
  private cache: Product[] | null = null;
  public isLoading = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private toastService: ToastService
  ) {}

  // Obtener todos los productos y parsear datos correctamente
  getProducts(): Observable<Product[]> {
    this.isLoading.next(true);

    return this.http.get<Product[]>(this.apiUrl).pipe(
      map((products) => products.map(this.transformProduct)), // Transformamos los datos
      tap((products) => {
        this.cache = products;
        this.isLoading.next(false);
      }),
      catchError((error) => {
        console.error('Error al cargar productos:', error);
        this.isLoading.next(false);

        if (this.cache) {
          console.warn('Cargando desde caché.');
          return of(this.cache);
        }

        this.toastService.showError('Error al cargar productos.');
        return of([]);
      })
    );
  }

  // Obtener un producto por ID y parsear los datos
  getProductById(id: number): Observable<Product | null> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
      map((product) => this.transformProduct(product)),
      catchError(() => {
        this.toastService.showError('No se pudo cargar el producto.');
        return of(null);
      })
    );
  }

  // Transformar producto recibido del backend
  private transformProduct(product: any): Product {
    return {
      ...product,
      price: Number(product.price), // Convertir a número
      sizes: (typeof product.sizes === 'string' 
        ? JSON.parse(product.sizes) 
        : product.sizes || []).map((size: any) => ({
          ...size,
          selected: false // Inicializar selección
        })),
      colors: typeof product.colors === 'string' 
        ? JSON.parse(product.colors) 
        : product.colors || [],
      images: typeof product.images === 'string' 
        ? JSON.parse(product.images) 
        : product.images || []
    };
  }

  // Crear un nuevo producto y convertir los datos a JSON antes de enviarlos
  createProduct(product: Product): Observable<Product> {
    const transformedProduct = this.prepareProductForBackend(product);
    return this.http.post<Product>(this.apiUrl, transformedProduct).pipe(
      tap(() => this.toastService.showSuccess('Producto creado con éxito.')),
      catchError((error) => {
        console.error('Error al crear producto:', error);
        this.toastService.showError('No se pudo crear el producto.');
        return of(transformedProduct);
      })
    );
  }

  // Actualizar un producto
  updateProduct(id: number, product: Product): Observable<Product> {
    const transformedProduct = this.prepareProductForBackend(product);
    return this.http.put<Product>(`${this.apiUrl}/${id}`, transformedProduct).pipe(
      tap(() => this.toastService.showSuccess('Producto actualizado con éxito.')),
      catchError((error) => {
        console.error('Error al actualizar producto:', error);
        this.toastService.showError('No se pudo actualizar el producto.');
        return of(transformedProduct);
      })
    );
  }

  // Eliminar un producto
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.toastService.showSuccess('Producto eliminado con éxito.')),
      catchError((error) => {
        console.error('Error al eliminar producto:', error);
        this.toastService.showError('No se pudo eliminar el producto.');
        return of(undefined);
      })
    );
  }

  // Preparar producto para enviarlo al backend
  private prepareProductForBackend(product: Product): any {
    return {
      ...product,
      sizes: JSON.stringify(product.sizes || []),
      colors: JSON.stringify(product.colors || []),
      images: JSON.stringify(product.images || [])
    };
  }
}