import { Request, Response } from 'express';
import { createProducto, getProductos, updateProducto, deleteProducto, getProducto } from '../models/producto';


export const getProduct = async (req: Request, res: Response) => {

    const { id } = req.params;
    try {

        const producto = await getProducto(Number(id));
        res.json(producto);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
};


export const getProducts = async (req: Request, res: Response) => {

    try {
        const productos = await getProductos();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
};


export const postProduct = async (req: Request, res: Response) => {

    const { nombre, descripcion, talla, precio, stock } = req.body;
    try {
        const result = await createProducto(nombre, descripcion, talla, Number(precio), Number(stock));
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el producto' });
    }
};


export const updateProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { nombre, descripcion, talla, precio, stock } = req.body;

    try {
        const productoExistente = await getProducto(Number(id));

        if (!productoExistente) {

            return res.status(404).json({
                msg: `No existe el producto con id ${id}`
            });
        }


        const result = await updateProducto(Number(id), nombre, descripcion, talla, Number(precio), Number(stock));


        res.json({
            msg: `El producto fue actualizado con éxito.`,
            result
        });

    } catch (error) {

        console.log(error);
        res.status(500).json({
            msg: `Ha ocurrido un error al actualizar el producto.`
        });
    }
}


export const deleteProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await deleteProducto(Number(id));
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
};
