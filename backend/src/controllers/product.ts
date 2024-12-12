import { Request, Response } from 'express';
import { createProduct, getProducts, getProduct, updateProduct, deleteProduct } from '../models/product';

export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const products = await getProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener los productos', error });
    }
};

export const getOneProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const product = await getProduct(Number(id));
        res.json(product);
    } catch (error) {
        res.status(404).json({ msg: 'Producto no encontrado', error });
    }
};

export const createProductController = async (req: Request, res: Response) => {
    const { name, description, size, price, stock } = req.body;
    try {
        const result = await createProduct(name, description, size, price, stock);
        res.status(201).json({ msg: 'Producto creado', result });
    } catch (error) {
        res.status(500).json({ msg: 'Error al crear el producto', error });
    }
}

export const updateProductController = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description, size, price, stock } = req.body;
    try {
        const result = await updateProduct(Number(id), name, description, size, price, stock);
        res.json({ msg: 'Producto actualizado', result });
    } catch (error) {
        res.status(500).json({ msg: 'Error al actualizar el producto', error });
    }
};

export const deleteProductController = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await deleteProduct(Number(id));
        res.json({ msg: 'Producto eliminado', result });
    } catch (error) {
        res.status(500).json({ msg: 'Error al eliminar el producto', error });
    }
};
