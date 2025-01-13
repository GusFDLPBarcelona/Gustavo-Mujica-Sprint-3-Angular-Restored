import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Project } from '../interfaces/project';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private apiUrl = 'http://localhost:4000/api/projects';
  private cache: Project[] | null = null;
  public isLoading = new BehaviorSubject<boolean>(false); // Estado de carga

  constructor(private http: HttpClient, private toastService: ToastService) {}

  getProjects(): Observable<Project[]> {
    this.isLoading.next(true); 
    if (this.cache) {
      console.log('Cache content:', this.cache);
      this.toastService.showInfo('Proyectos cargados desde la caché.');
      this.isLoading.next(false); 
      return of(this.cache);
    }
  
    return this.http.get<Project[]>(this.apiUrl).pipe(
      tap((projects) => {
        this.cache = projects;
        this.isLoading.next(false);
        console.log('Proyectos cargados desde la API:', projects);
      }),
      catchError((error) => {
        this.isLoading.next(false);
        this.toastService.showError('Error al cargar proyectos');
        console.error('Error al cargar proyectos:', error);
        return of([]);
      })
    );
  }

  getProjectImages(): Observable<string[]> {
    return this.http.get<Project[]>(this.apiUrl).pipe(
      map((projects) => projects.map((project) => project.image)),
      catchError((error) => {
        console.error('Error fetching project images:', error);
        this.toastService.showError('Error al cargar imágenes de proyectos.');
        return of([]); // Retorna un array vacío en caso de error
      })
    );
  }
  
  getProjectById(id: number): Observable<Project | null> {
    console.log(id);
    return this.http.get<Project>(`${this.apiUrl}/${id}`).pipe(
      catchError(() => {
        this.toastService.showError('No se pudo cargar el proyecto');
        return of(null); 
      })
    );
  }  
}
