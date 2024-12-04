import { Router } from 'express';
import { getAllGraficos, createGrafico, removeGrafico } from '../controllers/graficos';

const router = Router();

router.get('/test', (req, res) => {
    res.json({ message: 'Test exitoso' });
});

router.get('/', getAllGraficos);
router.post('/', createGrafico);
router.delete('/:id', removeGrafico);

export default router;
