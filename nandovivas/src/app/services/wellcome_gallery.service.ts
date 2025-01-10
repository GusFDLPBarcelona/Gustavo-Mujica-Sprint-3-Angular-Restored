import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { WellcomeGallery } from '../interfaces/wellcome_gallery';

@Injectable({
  providedIn: 'root',
})
export class WellcomeGalleryService {
private apiUrl = 'http://localhost:4000/api/gallery';

  constructor(private http: HttpClient) {}


  getGalleryItems(): Observable<WellcomeGallery[]> {
    return this.http.get<WellcomeGallery[]>(this.apiUrl).pipe(
        tap((data: WellcomeGallery[]) => console.log('Datos recibidos en el servicio:', data))
    );
  }


  addGalleryItem(item: WellcomeGallery): Observable<WellcomeGallery> {
    return this.http.post<WellcomeGallery>(this.apiUrl, item);
  }


  deleteGalleryItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
