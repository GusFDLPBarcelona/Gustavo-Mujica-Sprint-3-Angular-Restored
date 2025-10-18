import { Request, Response } from 'express';
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from '../models/product';
import { Product } from '../interfaces/product.backend';

// Obtener todos los productos
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
        const product = await getProductById(id);
        if (!product) {
            res.status(404).json({ msg: 'Producto no encontrado' });
        } else {
            res.status(200).json(product);
        }
    } catch (error) {
        console.error('Error al obtener producto:', error);
        res.status(500).json({ msg: 'Error al obtener producto', error });
    }
};

// Crear un nuevo producto
export const addProduct = async (req: Request, res: Response) => {
    try {
        const newProductData: Omit<Product, 'id'> = req.body;
        const newProduct = await createProduct(newProductData);
        res.status(201).json({ msg: 'Producto creado con éxito', product: newProduct });
    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).json({ msg: 'Error al crear producto', error });
    }
};

// Actualizar un producto existente
export const modifyProduct = async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;
    const productData: Partial<Product> = req.body;
    try {
        const updatedProduct = await updateProduct(id, productData);
        if (!updatedProduct) {
            res.status(404).json({ msg: 'Producto no encontrado' });
        } else {
            res.status(200).json({ msg: 'Producto actualizado con éxito', product: updatedProduct });
        }
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({ msg: 'Error al actualizar producto', error });
    }
};

// Eliminar un producto por ID
export const deleteOneProduct = async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;
    try {
        await deleteProduct(id);
        res.status(200).json({ msg: 'Producto eliminado con éxito' });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ msg: 'Error al eliminar producto', error });
    }
};
