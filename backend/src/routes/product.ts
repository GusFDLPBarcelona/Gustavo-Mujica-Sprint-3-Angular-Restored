import { Router } from 'express';
import { getProduct, getProducts, postProduct, updateProduct, deleteProduct } from '../controllers/producto';

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProduct);
router.delete('/:id', deleteProduct);
router.post('/', postProduct);
router.put('/:id', updateProduct);


export default router;
