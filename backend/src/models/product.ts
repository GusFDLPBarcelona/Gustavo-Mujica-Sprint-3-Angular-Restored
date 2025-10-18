import db from '../db/firebase';
import { Product } from '../interfaces/product.backend';

const PRODUCTS_COLLECTION = 'products';

// Obtener todos los productos
export const getProducts = async (): Promise<Product[]> => {
    const snapshot = await db.collection(PRODUCTS_COLLECTION).get();
    if (snapshot.empty) {
        return [];
    }
    const products: Product[] = [];
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

// Obtener un producto específico por ID
export const getProductById = async (id: string): Promise<Product | null> => {
    const docRef = db.collection(PRODUCTS_COLLECTION).doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
        return null;
    }

    const data = doc.data();
    if (!data) return null;

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

// Crear un nuevo producto
export const createProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
    const docRef = await db.collection(PRODUCTS_COLLECTION).add(product);
    return {
        id: docRef.id,
        ...product
    } as Product;
};

// Actualizar un producto existente
export const updateProduct = async (id: string, product: Partial<Product>): Promise<Product | null> => {
    const docRef = db.collection(PRODUCTS_COLLECTION).doc(id);
    await docRef.update(product);
    const updatedDoc = await docRef.get();
    if (!updatedDoc.exists) {
        return null;
    }
    const data = updatedDoc.data();
    if (!data) return null;

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

// Eliminar un producto
export const deleteProduct = async (id: string): Promise<{ msg: string }> => {
    await db.collection(PRODUCTS_COLLECTION).doc(id).delete();
    return { msg: 'Producto eliminado con éxito' };
};
