import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, addDoc, updateDoc, deleteDoc, getDocs } from '@angular/fire/firestore';
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

  // Migración única: convierte category (string) → categories (string[])
  // Solo actúa sobre documentos que aún no tienen el campo categories.
  async migrateCategories(): Promise<number> {
    const snapshot = await getDocs(this.projectsCollection);
    let count = 0;
    for (const docSnap of snapshot.docs) {
      const data = docSnap.data() as any;
      if (!data['categories'] && data['category']) {
        await updateDoc(docSnap.ref, { categories: [data['category']] });
        count++;
      }
    }
    return count;
  }
}
