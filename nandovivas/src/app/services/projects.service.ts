import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Project } from '../interfaces/project';
import { MOCK_PROJECTS } from '../mocks/mock-projects';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private apiUrl = 'http://localhost:3000/projects';
  private cache: Project[] | null = null;
  public isLoading = new BehaviorSubject<boolean>(false); // Estado de carga

  constructor(private http: HttpClient, private toastService: ToastService) {}

  getProjects(): Observable<Project[]> {
    this.isLoading.next(true); 
    if (this.cache) {
      this.toastService.showInfo('Proyectos cargados desde la caché.');
      this.isLoading.next(false); 
      return of(this.cache);
    }

    return this.http.get<Project[]>(this.apiUrl).pipe(
      tap((data) => {
        this.cache = data;
        this.toastService.showSuccess('Proyectos cargados correctamente.');
        this.isLoading.next(false); 
      }),
      catchError((error) => {
        console.error('Error al conectar con la base de datos:', error.message || error);
        this.toastService.showError('Error al cargar proyectos, usando datos locales.');
        this.isLoading.next(false); 
        return of(MOCK_PROJECTS); 
      })
    );
  }

  getProjectImages(): Observable<string[]> {
    return this.http.get<Project[]>(this.apiUrl).pipe(
      map((projects) => projects.map((project) => project.image)),
      catchError((error) => {
        console.error('Error fetching project images:', error);
        return of([]); // En caso de error, devolver un array vacío
      })
    );
  }
  
  getProjectById(id: number): Observable<Project | null> {
    return this.http.get<Project>(`${this.apiUrl}/${id}`).pipe(
      catchError(() => {
        this.toastService.showError('No se pudo cargar el proyecto');
        return of(null); 
      })
    );
  }  
}
