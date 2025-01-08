import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../interfaces/product';
/*import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  private myAppUrl: string;
  private myApiUrl: string;

  constructor(private http: HttpClient) {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/productos/';
  }


  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.myAppUrl}${this.myApiUrl}`);
  }

  agregarProducto(producto: Producto): Observable<any> {
    return this.http.post<any>(`${this.myAppUrl}${this.myApiUrl}`, producto);
  }

  eliminarProducto(id: number): Observable<any> {
    return this.http.delete<any>(`${this.myAppUrl}${this.myApiUrl}/${id}`);
  }

  editarProducto(id: number, producto: Producto): Observable<any> {
    return this.http.put<any>(`${this.myAppUrl}${this.myApiUrl}/${id}`, producto);
  }

  obtenerPorId(id: number): Observable<any> {
    return this.http.get(`${this.myAppUrl}${this.myApiUrl}/${id}`);
  }

}

*/
