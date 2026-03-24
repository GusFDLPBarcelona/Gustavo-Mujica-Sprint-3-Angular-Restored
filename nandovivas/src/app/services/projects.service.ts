import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, addDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
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

  createProject(data: Omit<Project, 'id' | 'matchesFilter'>): Promise<string> {
    return addDoc(this.projectsCollection, data).then(ref => ref.id);
  }

  updateProject(id: string, data: Partial<Omit<Project, 'id' | 'matchesFilter'>>): Promise<void> {
    return updateDoc(doc(this.firestore, 'projects', id), { ...data });
  }

  deleteProject(id: string): Promise<void> {
    return deleteDoc(doc(this.firestore, 'projects', id));
  }
}
