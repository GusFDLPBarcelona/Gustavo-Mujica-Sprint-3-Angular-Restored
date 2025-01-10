import { Router } from 'express';
import { getAllGalleryImages, addGalleryItem, deleteGalleryItem } from '../controllers/gallery';

const router = Router();

router.get('/', (req, res) => {
    console.log('Solicitud recibida en /api/gallery'); 
    getAllGalleryImages(req, res); 
});

router.post('/', (req, res) => {
    console.log('Solicitud POST recibida en /api/gallery'); 
    addGalleryItem(req, res); 
});

router.delete('/:id', (req, res) => {
    console.log(`Solicitud DELETE recibida en /api/gallery con ID: ${req.params.id}`); 
    deleteGalleryItem(req, res); 
});

export default router;
