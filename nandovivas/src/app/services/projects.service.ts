import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, addDoc, updateDoc, deleteDoc, getDocs, query, where } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
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

  getProjectBySlug(slug: string): Observable<Project | null> {
    const q = query(this.projectsCollection, where('slug', '==', slug));
    return from(
      getDocs(q).then(snapshot => {
        if (snapshot.empty) return null;
        const d = snapshot.docs[0];
        return { id: d.id, ...d.data() } as Project;
      })
    );
  }

  // Devuelve el título del proyecto conflictivo si el slug ya está en uso, o null si está libre
  async checkSlugExists(slug: string, excludeId?: string): Promise<string | null> {
    const q = query(this.projectsCollection, where('slug', '==', slug));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const conflict = snapshot.docs.find(d => d.id !== excludeId);
    if (!conflict) return null;
    return (conflict.data() as any)['title'] ?? 'otro proyecto';
  }

  // Genera un slug legible a partir de un título
  static generateSlug(title: string): string {
    return title
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')   // quita diacríticos (á→a, ñ→n…)
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')      // elimina chars especiales
      .trim()
      .replace(/\s+/g, '-')              // espacios → guiones
      .replace(/-+/g, '-');              // guiones múltiples → uno
  }

  // Migración: genera y asigna slug a todos los proyectos que no lo tienen
  async migrateSlugs(): Promise<number> {
    const snapshot = await getDocs(this.projectsCollection);
    const usedSlugs = new Set<string>();
    let count = 0;

    // Primera pasada: registrar slugs ya existentes
    for (const docSnap of snapshot.docs) {
      const data = docSnap.data() as any;
      if (data['slug']) usedSlugs.add(data['slug']);
    }

    // Segunda pasada: asignar slug a los que no tienen
    for (const docSnap of snapshot.docs) {
      const data = docSnap.data() as any;
      if (!data['slug'] && data['title']) {
        let slug = ProjectsService.generateSlug(data['title']);
        // Garantizar unicidad añadiendo sufijo numérico si hace falta
        if (usedSlugs.has(slug)) {
          let suffix = 2;
          while (usedSlugs.has(`${slug}-${suffix}`)) suffix++;
          slug = `${slug}-${suffix}`;
        }
        usedSlugs.add(slug);
        await updateDoc(docSnap.ref, { slug });
        count++;
      }
    }
    return count;
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
