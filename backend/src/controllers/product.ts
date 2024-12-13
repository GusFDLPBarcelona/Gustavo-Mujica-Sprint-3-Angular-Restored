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

    if (!name || name.length < 3) {
        return res.status(400).json({ msg: 'El nombre del producto es obligatorio y debe tener al menos 3 caracteres.' });
    }
    if (!description || description.length < 10) {
        return res.status(400).json({ msg: 'La descripción es obligatoria y debe tener al menos 10 caracteres.' });
    }
    if (!size || !['S', 'M', 'L', 'XL'].includes(size.toUpperCase())) {
        return res.status(400).json({ msg: 'La talla es obligatoria y debe ser una de las siguientes: S, M, L, XL.' });
    }
    if (!price || typeof price !== 'number' || price <= 0) {
        return res.status(400).json({ msg: 'El precio es obligatorio y debe ser un número mayor a 0.' });
    }
    if (stock && (typeof stock !== 'number' || stock < 0)) {
        return res.status(400).json({ msg: 'El stock, si se proporciona, debe ser un número mayor o igual a 0.' });
    }

    try {
        const result = await createProduct(name, description, size.toUpperCase(), price, stock || 0);
        res.status(201).json({ msg: 'Producto creado', result });
    } catch (error) {
        res.status(500).json({ msg: 'Error al crear el producto', error });
    }
};

export const updateProductController = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description, size, price, stock } = req.body;

    // Validaciones
    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ msg: 'El ID del producto es obligatorio y debe ser un número válido.' });
    }
    if (name && (typeof name !== 'string' || name.length < 3)) {
        return res.status(400).json({ msg: 'Si se proporciona, el nombre debe tener al menos 3 caracteres.' });
    }
    if (description && (typeof description !== 'string' || description.length < 10)) {
        return res.status(400).json({ msg: 'Si se proporciona, la descripción debe tener al menos 10 caracteres.' });
    }
    if (size && !['S', 'M', 'L', 'XL'].includes(size.toUpperCase())) {
        return res.status(400).json({ msg: 'Si se proporciona, la talla debe ser una de las siguientes: S, M, L, XL.' });
    }
    if (price && (typeof price !== 'number' || price <= 0)) {
        return res.status(400).json({ msg: 'Si se proporciona, el precio debe ser un número mayor a 0.' });
    }
    if (stock && (typeof stock !== 'number' || stock < 0)) {
        return res.status(400).json({ msg: 'Si se proporciona, el stock debe ser un número mayor o igual a 0.' });
    }

    try {
        const result = await updateProduct(Number(id), name, description, size ? size.toUpperCase() : undefined, price, stock);
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
