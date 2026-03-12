import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, deleteDoc, doc } from '@angular/fire/firestore';
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

  addGalleryItem(item: Omit<WellcomeGallery, 'id'>): Promise<void> {
    return addDoc(this.galleryCollection, item).then(() => {});
  }

  deleteGalleryItem(id: string): Promise<void> {
    return deleteDoc(doc(this.firestore, 'gallery', id));
  }
}
