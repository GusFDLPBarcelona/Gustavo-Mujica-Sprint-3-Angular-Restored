import { Request, Response } from 'express';
import { getGalleryImages, addGalleryItem, deleteGalleryItem } from '../models/wellcome_gallery';

// Obtener todas las imágenes de la galería
export const getAllGalleryImages = async (req: Request, res: Response) => {
    try {
        const rows = await getGalleryImages();
        console.log("Imágenes obtenidas desde la base de datos:", rows);
        if (!rows || rows.length === 0) {
            return res.status(404).json({ message: 'No hay imágenes disponibles en la galería.' });
        }
        return res.status(200).json(rows); // Se usa return para evitar que el código continúe
    } catch (error) {
        console.error('Error al obtener las imágenes de la galería:', error);
        return res.status(500).json({ message: 'Error al obtener las imágenes de la galería', error });
    }
};

// Agregar un nuevo elemento a la galería
export const addGalleryItemController = async (req: Request, res: Response) => {
    try {
        const newId = await addGalleryItem(req.body);
        res.status(201).json({ id: newId, message: 'Imagen añadida correctamente' });
    } catch (error) {
        console.error('Error al agregar imagen a la galería:', error);
        res.status(500).json({ message: 'Error al agregar imagen a la galería' });
    }
};

// Eliminar una imagen de la galería por ID
export const deleteGalleryItemController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await deleteGalleryItem(Number(id));
        res.status(204).send();
    } catch (error) {
        console.error('Error al eliminar imagen de la galería:', error);
        res.status(500).json({ message: 'Error al eliminar imagen de la galería' });
    }
};
