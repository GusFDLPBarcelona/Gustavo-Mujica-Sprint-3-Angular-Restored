import db from '../db/connection';
import { WellcomeGallery } from '../interfaces/wellcome_gallery';

export const getGalleryImages = async (): Promise<WellcomeGallery[]> => {
  const [rows] = await db.query('SELECT * FROM wellcome_gallery');
  console.log('Datos obtenidos de la base de datos:', rows);
  return rows as WellcomeGallery[];
};

export const addGalleryItem = async (item: WellcomeGallery): Promise<number> => {
  const { image_path, title, client } = item;
  const [result]: any = await db.query(
    'INSERT INTO wellcome_gallery (image_path, title, client) VALUES (?, ?, ?)',
    [image_path, title, client]
  );
  return result.insertId; // Devuelve el ID del nuevo registro
};

export const deleteGalleryItem = async (id: number): Promise<void> => {
  await db.query('DELETE FROM wellcome_gallery WHERE id = ?', [id]);
};
