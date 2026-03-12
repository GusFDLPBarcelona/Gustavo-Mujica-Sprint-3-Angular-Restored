import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Project } from '../interfaces/project';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private firestore = inject(Firestore);
  private projectsCollection = collection(this.firestore, 'projects');

  getProjects(): Observable<Project[]> {
    return collectionData(this.projectsCollection, { idField: 'id' }) as Observable<Project[]>;
  }

  getProjectById(id: string): Observable<Project | null> {
    return docData(doc(this.firestore, 'projects', id), { idField: 'id' }) as Observable<Project | null>;
  }
}
