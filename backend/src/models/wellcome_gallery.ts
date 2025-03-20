import db from '../db/connection';
import { WellcomeGallery } from '../interfaces/wellcome_gallery';

// Obtener todas las imágenes de la galería
export const getGalleryImages = async (): Promise<WellcomeGallery[]> => {
    const [rows] = await db.query('SELECT * FROM wellcome_gallery');
    return rows as WellcomeGallery[];
};

// Agregar un nuevo elemento a la galería
export const addGalleryItem = async (item: WellcomeGallery): Promise<number> => {
    const { image_path, title, client } = item;
    const [result]: any = await db.query(
        'INSERT INTO wellcome_gallery (image_path, title, client) VALUES (?, ?, ?)',
        [image_path, title, client]
    );
    return result.insertId;
};

// Eliminar una imagen de la galería por ID
export const deleteGalleryItem = async (id: number): Promise<void> => {
    await db.query('DELETE FROM wellcome_gallery WHERE id = ?', [id]);
};
