import { Request, Response } from 'express';
import { 
    getProducts, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct 
} from '../models/product';
import { Product } from '../interfaces/product.backend';

// Obtener todos los productos con variantes
export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const products = await getProducts();
        res.status(200).json(products);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ msg: 'Error al obtener productos', error });
    }
};

// Obtener un solo producto por ID
export const getOneProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const product = await getProductById(Number(id));
        if (!product) {
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error('Error al obtener producto:', error);
        res.status(500).json({ msg: 'Error al obtener producto', error });
    }
};

// Crear un nuevo producto con variantes
export const addProduct = async (req: Request<{}, {}, Product>, res: Response) => {
    try {
        const { name, description, image, sizes, colors, price } = req.body;
        const newProduct = await createProduct({
            name,
            description,
            image,
            price,
            sizes: sizes ?? [], // Si `sizes` es undefined, usa un array vacío
            colors: colors ?? [], // Si `colors` es undefined, usa un array vacío
        });
        res.status(201).json({ msg: 'Producto creado con éxito', product: newProduct });
    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).json({ msg: 'Error al crear producto', error });
    }
};

// Actualizar un producto existente
export const modifyProduct = async (req: Request<{ id: string }, {}, Product>, res: Response) => {
    const { id } = req.params;
    try {
        const { name, description, image, sizes, colors, price } = req.body;
        const updatedProduct = await updateProduct(Number(id), {
            name,
            description,
            image,
            price,
            sizes: sizes ?? [],
            colors: colors ?? [],
        });
        res.status(200).json({ msg: 'Producto actualizado con éxito', product: updatedProduct });
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({ msg: 'Error al actualizar producto', error });
    }
};

// Eliminar un producto por ID
export const deleteOneProduct = async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;
    try {
        await deleteProduct(Number(id));
        res.status(200).json({ msg: 'Producto eliminado con éxito' });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ msg: 'Error al eliminar producto', error });
    }
};
