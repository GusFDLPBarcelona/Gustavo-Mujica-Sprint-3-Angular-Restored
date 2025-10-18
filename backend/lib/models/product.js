"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getProducts = void 0;
const firebase_1 = __importDefault(require("../db/firebase"));
const PRODUCTS_COLLECTION = 'products';
// Obtener todos los productos
const getProducts = async () => {
    const snapshot = await firebase_1.default.collection(PRODUCTS_COLLECTION).get();
    if (snapshot.empty) {
        return [];
    }
    const products = [];
    snapshot.forEach(doc => {
        const data = doc.data();
        products.push({
            id: doc.id,
            name: data.name,
            description: data.description,
            image: data.image,
            price: data.price,
            sizes: data.sizes,
            colors: data.colors,
            images: data.images,
            category: data.category
        });
    });
    return products;
};
exports.getProducts = getProducts;
// Obtener un producto específico por ID
const getProductById = async (id) => {
    const docRef = firebase_1.default.collection(PRODUCTS_COLLECTION).doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
        return null;
    }
    const data = doc.data();
    if (!data)
        return null;
    return {
        id: doc.id,
        name: data.name,
        description: data.description,
        image: data.image,
        price: data.price,
        sizes: data.sizes,
        colors: data.colors,
        images: data.images,
        category: data.category
    };
};
exports.getProductById = getProductById;
// Crear un nuevo producto
const createProduct = async (product) => {
    const docRef = await firebase_1.default.collection(PRODUCTS_COLLECTION).add(product);
    return {
        id: docRef.id,
        ...product
    };
};
exports.createProduct = createProduct;
// Actualizar un producto existente
const updateProduct = async (id, product) => {
    const docRef = firebase_1.default.collection(PRODUCTS_COLLECTION).doc(id);
    await docRef.update(product);
    const updatedDoc = await docRef.get();
    if (!updatedDoc.exists) {
        return null;
    }
    const data = updatedDoc.data();
    if (!data)
        return null;
    return {
        id: updatedDoc.id,
        name: data.name,
        description: data.description,
        image: data.image,
        price: data.price,
        sizes: data.sizes,
        colors: data.colors,
        images: data.images,
        category: data.category
    };
};
exports.updateProduct = updateProduct;
// Eliminar un producto
const deleteProduct = async (id) => {
    await firebase_1.default.collection(PRODUCTS_COLLECTION).doc(id).delete();
    return { msg: 'Producto eliminado con éxito' };
};
exports.deleteProduct = deleteProduct;
//# sourceMappingURL=product.js.map