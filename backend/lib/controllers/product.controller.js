"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOneProduct = exports.modifyProduct = exports.addProduct = exports.getOneProduct = exports.getAllProducts = void 0;
const product_1 = require("../models/product");
// Obtener todos los productos
const getAllProducts = async (req, res) => {
    try {
        const products = await (0, product_1.getProducts)();
        res.status(200).json(products);
    }
    catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ msg: 'Error al obtener productos', error });
    }
};
exports.getAllProducts = getAllProducts;
// Obtener un solo producto por ID
const getOneProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await (0, product_1.getProductById)(id);
        if (!product) {
            res.status(404).json({ msg: 'Producto no encontrado' });
        }
        else {
            res.status(200).json(product);
        }
    }
    catch (error) {
        console.error('Error al obtener producto:', error);
        res.status(500).json({ msg: 'Error al obtener producto', error });
    }
};
exports.getOneProduct = getOneProduct;
// Crear un nuevo producto
const addProduct = async (req, res) => {
    try {
        const newProductData = req.body;
        const newProduct = await (0, product_1.createProduct)(newProductData);
        res.status(201).json({ msg: 'Producto creado con éxito', product: newProduct });
    }
    catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).json({ msg: 'Error al crear producto', error });
    }
};
exports.addProduct = addProduct;
// Actualizar un producto existente
const modifyProduct = async (req, res) => {
    const { id } = req.params;
    const productData = req.body;
    try {
        const updatedProduct = await (0, product_1.updateProduct)(id, productData);
        if (!updatedProduct) {
            res.status(404).json({ msg: 'Producto no encontrado' });
        }
        else {
            res.status(200).json({ msg: 'Producto actualizado con éxito', product: updatedProduct });
        }
    }
    catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({ msg: 'Error al actualizar producto', error });
    }
};
exports.modifyProduct = modifyProduct;
// Eliminar un producto por ID
const deleteOneProduct = async (req, res) => {
    const { id } = req.params;
    try {
        await (0, product_1.deleteProduct)(id);
        res.status(200).json({ msg: 'Producto eliminado con éxito' });
    }
    catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ msg: 'Error al eliminar producto', error });
    }
};
exports.deleteOneProduct = deleteOneProduct;
//# sourceMappingURL=product.controller.js.map