import { Router } from 'express';
import { getAllMarkers, createMarker, removeMarker } from '../controllers/marcadores';

const router = Router();

router.get('/', getAllMarkers);
router.post('/', createMarker);
router.delete('/:id', removeMarker);

export default router;
