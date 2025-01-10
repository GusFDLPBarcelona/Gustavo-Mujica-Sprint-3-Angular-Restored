import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ProjectsService } from '../services/projects.service';
import { Project } from '../interfaces/project';

@Injectable({
  providedIn: 'root'
})
export class ProjectResolver implements Resolve<Project | null> {
  constructor(private projectsService: ProjectsService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Project | null> {
    const id = route.paramMap.get('id');
    if (!id) {
      return of(null); 
    }
    return this.projectsService.getProjectById(Number(id));
  }
}
