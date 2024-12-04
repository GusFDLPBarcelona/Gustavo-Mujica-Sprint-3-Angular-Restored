import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Project } from '../interfaces/project';
import { MOCK_PROJECTS } from '../mocks/mock-projects';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private apiUrl = 'http://localhost:3000/projects';
  private cache: Project[] | null = null;

  constructor(private http: HttpClient, private toastService: ToastService) {}

  getProjects(): Observable<Project[]> {
    if (this.cache) {
      this.toastService.showInfo('Proyectos cargados desde la caché.');
      return of(this.cache);
    }

    return this.http.get<Project[]>(this.apiUrl).pipe(
      tap(data => {
        this.cache = data;
        this.toastService.showSuccess('Proyectos cargados correctamente.');
      }),
      catchError(error => {
        console.error('Error al conectar con la base de datos:', error.message || error);
        this.toastService.showError('Error al cargar proyectos, usando datos locales.');
        return of(MOCK_PROJECTS); // Fallback a datos simulados
      })
    );
  }
}
