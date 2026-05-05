import { Injectable, inject } from '@angular/core';
import {
  Firestore, collection, collectionData, doc, docData,
  addDoc, updateDoc, deleteDoc, getDocs, query, where, setDoc
} from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { Product, ShopSettings } from '../interfaces/product';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private firestore = inject(Firestore);
  private productsCollection = collection(this.firestore, 'products');

  getProducts(): Observable<Product[]> {
    return collectionData(this.productsCollection, { idField: 'id' }) as Observable<Product[]>;
  }

  getProductById(id: string): Observable<Product | null> {
    return docData(doc(this.firestore, 'products', id), { idField: 'id' }) as Observable<Product | null>;
  }

  getProductBySlug(slug: string): Observable<Product | null> {
    const q = query(this.productsCollection, where('slug', '==', slug));
    return from(
      getDocs(q).then(snapshot => {
        if (snapshot.empty) return null;
        const d = snapshot.docs[0];
        return { id: d.id, ...d.data() } as Product;
      })
    );
  }

  async checkSlugExists(slug: string, excludeId?: string): Promise<string | null> {
    const q = query(this.productsCollection, where('slug', '==', slug));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const conflict = snapshot.docs.find(d => d.id !== excludeId);
    if (!conflict) return null;
    return (conflict.data() as any)['name'] ?? 'otro producto';
  }

  static generateSlug(name: string): string {
    return name
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  createProduct(data: Omit<Product, 'id'>): Promise<string> {
    return addDoc(this.productsCollection, data).then(ref => ref.id);
  }

  updateProduct(id: string, data: Partial<Omit<Product, 'id'>>): Promise<void> {
    return updateDoc(doc(this.firestore, 'products', id), { ...data });
  }

  deleteProduct(id: string): Promise<void> {
    return deleteDoc(doc(this.firestore, 'products', id));
  }

  getShopSettings(): Observable<ShopSettings | null> {
    return docData(doc(this.firestore, 'settings', 'shop')) as Observable<ShopSettings | null>;
  }

  async updateShopSettings(data: ShopSettings): Promise<void> {
    return setDoc(doc(this.firestore, 'settings', 'shop'), { ...data });
  }
}
