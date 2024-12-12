import { Router } from 'express';
import { getAllProducts, getOneProduct, createProductController, updateProductController, deleteProductController } from '../controllers/product';

const router = Router();

router.get('/', getAllProducts); 
router.get('/:id', getOneProduct); 
router.post('/', createProductController); 
router.put('/:id', updateProductController); 
router.delete('/:id', deleteProductController); 

export default router;
