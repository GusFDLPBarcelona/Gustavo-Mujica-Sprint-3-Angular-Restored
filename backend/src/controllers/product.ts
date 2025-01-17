import { Request, Response } from 'express';
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from '../models/product';
import { Product } from '../interfaces/product';

export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const products = await getProducts(); // Llamamos directamente al modelo
        res.status(200).json(products);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ msg: 'Error al obtener productos', error });
    }
};

export const getOneProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const product = await getProduct(Number(id));
        if (!product) {
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error('Error al obtener producto:', error);
        res.status(500).json({ msg: 'Error al obtener producto', error });
    }
};

export const addProduct = async (req: Request<{}, {}, Product>, res: Response) => {
    const { name, description, size, price, stock, image } = req.body;
    try {
        const result = await createProduct({ name, description, size, price, stock, image, category: 'default' });
        res.status(201).json({ msg: 'Producto creado', result });
    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).json({ msg: 'Error al crear producto', error });
    }
};

export const modifyProduct = async (req: Request<{ id: string }, {}, Product>, res: Response) => {
    const { id } = req.params;
    const { name, description, size, price, stock, image } = req.body;
    try {
        const result = await updateProduct(Number(id), { name, description, size, price, stock, image, category: 'default'});
        res.status(200).json({ msg: 'Producto actualizado', result });
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({ msg: 'Error al actualizar producto', error });
    }
};

export const deleteOneProduct = async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;
    try {
        const result = await deleteProduct(Number(id));
        res.status(200).json({ msg: 'Producto eliminado', result });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ msg: 'Error al eliminar producto', error });
    }
};
