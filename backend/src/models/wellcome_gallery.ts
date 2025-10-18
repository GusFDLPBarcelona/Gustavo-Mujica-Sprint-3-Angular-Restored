import db from '../db/firebase';
import { WellcomeGallery } from '../interfaces/wellcome_gallery';

const GALLERY_COLLECTION = 'gallery';

// Obtener todas las imágenes de la galería
export const getGalleryImages = async (): Promise<WellcomeGallery[]> => {
    const snapshot = await db.collection(GALLERY_COLLECTION).get();
    if (snapshot.empty) {
        return [];
    }
    const images: WellcomeGallery[] = [];
    snapshot.forEach(doc => {
        images.push({ id: doc.id, ...doc.data() } as WellcomeGallery);
    });
    return images;
};

// Agregar un nuevo elemento a la galería
export const addGalleryItem = async (item: Omit<WellcomeGallery, 'id'>): Promise<WellcomeGallery> => {
    const docRef = await db.collection(GALLERY_COLLECTION).add(item);
    return { id: docRef.id, ...item } as WellcomeGallery;
};

// Eliminar una imagen de la galería por ID
export const deleteGalleryItem = async (id: string): Promise<{ msg: string }> => {
    await db.collection(GALLERY_COLLECTION).doc(id).delete();
    return { msg: 'Imagen eliminada con éxito' };
};
