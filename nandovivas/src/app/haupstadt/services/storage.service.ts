import { Injectable, inject } from '@angular/core';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private storage = inject(Storage);

  // Convierte cualquier imagen (JPG, PNG, etc.) a WebP antes de subirla.
  // Calidad 0.85: buen equilibrio entre peso y nitidez visual.
  private convertToWebP(file: File): Promise<Blob> {
    return new Promise((resolve) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext('2d')!.drawImage(img, 0, 0);
        canvas.toBlob(blob => {
          resolve(blob!);
          URL.revokeObjectURL(objectUrl);
        }, 'image/webp', 0.85);
      };
      img.src = objectUrl;
    });
  }

  // Sube una imagen convirtiéndola a WebP automáticamente.
  // El path recibido puede tener cualquier extensión — se reemplaza por .webp.
  async uploadImage(path: string, file: File): Promise<string> {
    const webpBlob = await this.convertToWebP(file);
    const webpPath = path.replace(/\.[^.]+$/, '.webp');
    const storageRef = ref(this.storage, webpPath);
    await uploadBytes(storageRef, webpBlob, { contentType: 'image/webp' });
    return getDownloadURL(storageRef);
  }
}
