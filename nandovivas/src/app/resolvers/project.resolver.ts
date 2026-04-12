import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { ProjectsService } from '../services/projects.service';
import { Project } from '../interfaces/project';

@Injectable({
  providedIn: 'root'
})
export class ProjectResolver implements Resolve<Project | null> {
  constructor(private projectsService: ProjectsService) {}

  resolve(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<Project | null> {
    const slug = route.paramMap.get('slug');
    if (!slug) return of(null);

    // Intenta por slug; si no encuentra nada, intenta por ID (compatibilidad durante migración)
    return this.projectsService.getProjectBySlug(slug).pipe(
      take(1),
      switchMap(project => project ? of(project) : this.projectsService.getProjectById(slug).pipe(take(1)))
    );
  }
}
