"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGalleryItemController = exports.addGalleryItemController = exports.getAllGalleryImages = void 0;
const wellcome_gallery_1 = require("../models/wellcome_gallery");
// Obtener todas las imágenes de la galería
const getAllGalleryImages = async (req, res) => {
    try {
        const images = await (0, wellcome_gallery_1.getGalleryImages)();
        if (!images.length) {
            res.status(404).json({ message: 'No hay imágenes disponibles en la galería.' });
        }
        else {
            res.status(200).json(images);
        }
    }
    catch (error) {
        console.error('Error al obtener las imágenes de la galería:', error);
        res.status(500).json({ message: 'Error al obtener las imágenes de la galería', error });
    }
};
exports.getAllGalleryImages = getAllGalleryImages;
// Agregar un nuevo elemento a la galería
const addGalleryItemController = async (req, res) => {
    try {
        const itemData = req.body;
        if (!itemData.image_path || !itemData.title) {
            res.status(400).json({ msg: 'La ruta de la imagen y el título son obligatorios' });
        }
        else {
            const newItem = await (0, wellcome_gallery_1.addGalleryItem)(itemData);
            res.status(201).json({ message: 'Imagen añadida correctamente', item: newItem });
        }
    }
    catch (error) {
        console.error('Error al agregar imagen a la galería:', error);
        res.status(500).json({ message: 'Error al agregar imagen a la galería', error });
    }
};
exports.addGalleryItemController = addGalleryItemController;
// Eliminar una imagen de la galería por ID
const deleteGalleryItemController = async (req, res) => {
    const { id } = req.params;
    try {
        await (0, wellcome_gallery_1.deleteGalleryItem)(id);
        res.status(200).json({ msg: 'Imagen eliminada con éxito' });
    }
    catch (error) {
        console.error('Error al eliminar imagen de la galería:', error);
        res.status(500).json({ message: 'Error al eliminar imagen de la galería', error });
    }
};
exports.deleteGalleryItemController = deleteGalleryItemController;
//# sourceMappingURL=gallery.js.map