import { Request, Response } from 'express';
import db from '../db/connection';
import { getGalleryImages } from '../models/wellcome_gallery'

export const getAllGalleryImages = async (req: Request, res: Response) => {
    try {
        const rows = await getGalleryImages();
        if (!rows || rows.length === 0) {
            return res.status(404).json({ message: 'No hay imágenes disponibles en la galería.' });
        }
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error al obtener las imágenes de la galería:', error);
        res.status(500).json({ message: 'Error al obtener las imágenes de la galería', error });
    }
};

export const addGalleryItem = async (req: Request, res: Response) => {
    try {
        const { image_path, title, client } = req.body;
        const [result]: any = await db.query(
            'INSERT INTO wellcome_gallery (image_path, title, client) VALUES (?, ?, ?)',
            [image_path, title, client]
        );
        res.status(201).json({ id: result.insertId, image_path, title, client });
    } catch (error) {
        console.error('Error adding gallery item:', error);
        res.status(500).json({ message: 'Error adding gallery item' });
    }
};

export const deleteGalleryItem = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM wellcome_gallery WHERE id = ?', [id]);
        res.status(204).send(); // Respuesta sin contenido
    } catch (error) {
        console.error('Error deleting gallery item:', error);
        res.status(500).json({ message: 'Error deleting gallery item' });
    }
};
