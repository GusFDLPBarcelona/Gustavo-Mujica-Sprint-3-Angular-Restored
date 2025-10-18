import { Request, Response } from 'express';
import { getGalleryImages, addGalleryItem, deleteGalleryItem } from '../models/wellcome_gallery';
import { WellcomeGallery } from '../interfaces/wellcome_gallery';

// Obtener todas las imágenes de la galería
export const getAllGalleryImages = async (req: Request, res: Response) => {
    try {
        const images = await getGalleryImages();
        if (!images.length) {
            res.status(404).json({ message: 'No hay imágenes disponibles en la galería.' });
        } else {
            res.status(200).json(images);
        }
    } catch (error) {
        console.error('Error al obtener las imágenes de la galería:', error);
        res.status(500).json({ message: 'Error al obtener las imágenes de la galería', error });
    }
};

// Agregar un nuevo elemento a la galería
export const addGalleryItemController = async (req: Request, res: Response) => {
    try {
        const itemData: Omit<WellcomeGallery, 'id'> = req.body;
        if (!itemData.image_path || !itemData.title) {
            res.status(400).json({ msg: 'La ruta de la imagen y el título son obligatorios' });
        } else {
            const newItem = await addGalleryItem(itemData);
            res.status(201).json({ message: 'Imagen añadida correctamente', item: newItem });
        }
    } catch (error) {
        console.error('Error al agregar imagen a la galería:', error);
        res.status(500).json({ message: 'Error al agregar imagen a la galería', error });
    }
};

// Eliminar una imagen de la galería por ID
export const deleteGalleryItemController = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await deleteGalleryItem(id);
        res.status(200).json({ msg: 'Imagen eliminada con éxito' });
    } catch (error) {
        console.error('Error al eliminar imagen de la galería:', error);
        res.status(500).json({ message: 'Error al eliminar imagen de la galería', error });
    }
};
