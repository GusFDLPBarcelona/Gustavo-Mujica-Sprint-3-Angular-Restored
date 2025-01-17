import { Router } from 'express';
import { getAllProducts, getOneProduct, addProduct, modifyProduct, deleteOneProduct } from '../controllers/product';

const router = Router();

router.get('/', getAllProducts); 
router.get('/:id', getOneProduct);
router.post('/', addProduct);
router.put('/:id', modifyProduct);
router.delete('/:id', deleteOneProduct);

export default router;
