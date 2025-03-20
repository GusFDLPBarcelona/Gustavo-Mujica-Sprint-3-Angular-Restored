import { Router } from 'express';
import { getAllGalleryImages, addGalleryItem, deleteGalleryItem } from '../controllers/gallery';

const router = Router();

// Ruta corregida para que `/api/gallery` devuelva una respuesta válida
router.get('/', (req, res) => {
    console.log('Solicitud GET recibida en /api/gallery'); 
    res.json({ message: "API funcionando correctamente" });
    getAllGalleryImages(req, res); 
});

// Ruta para agregar una imagen a la galería
router.post('/', (req, res) => {
    console.log('Solicitud POST recibida en /api/gallery'); 
    addGalleryItem(req, res); 
});

// Ruta para eliminar una imagen de la galería por ID
router.delete('/:id', (req, res) => {
    console.log(`Solicitud DELETE recibida en /api/gallery con ID: ${req.params.id}`); 
    deleteGalleryItem(req, res); 
});

// Respuesta de prueba para asegurarnos de que la API funciona
router.get('/test', (req, res) => {
    res.json({ message: "API Gallery funcionando correctamente" });
});

export default router;
