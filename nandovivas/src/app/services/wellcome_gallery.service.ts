import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, deleteDoc, doc, docData, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { WellcomeGallery } from '../interfaces/wellcome_gallery';

@Injectable({
  providedIn: 'root',
})
export class WellcomeGalleryService {
  private firestore = inject(Firestore);
  private galleryCollection = collection(this.firestore, 'gallery');

  getGalleryItems(): Observable<WellcomeGallery[]> {
    return collectionData(this.galleryCollection, { idField: 'id' }) as Observable<WellcomeGallery[]>;
  }

  getGalleryItemById(id: string): Observable<WellcomeGallery | undefined> {
    return docData(doc(this.firestore, 'gallery', id), { idField: 'id' }) as Observable<WellcomeGallery | undefined>;
  }

  addGalleryItem(item: Omit<WellcomeGallery, 'id'>): Promise<void> {
    return addDoc(this.galleryCollection, item).then(() => {});
  }

  // updateDoc solo actualiza los campos indicados, no borra el resto del documento
  updateGalleryItem(id: string, data: Partial<Omit<WellcomeGallery, 'id'>>): Promise<void> {
    return updateDoc(doc(this.firestore, 'gallery', id), { ...data });
  }

  deleteGalleryItem(id: string): Promise<void> {
    return deleteDoc(doc(this.firestore, 'gallery', id));
  }
}
