import connection from '../db/connection';
import { Product } from '../interfaces/product';

export const getProducts = async (): Promise<Product[]> => {
    const [rows] = await connection.query('SELECT * FROM products');
    return rows as Product[];
};

export const getProduct = async (id: number): Promise<Product | null> => {
    const [rows]: any = await connection.query('SELECT * FROM products WHERE id = ?', [id]);
    return rows.length > 0 ? rows[0] : null;
};

export const createProduct = async (product: Product): Promise<any> => {
    const { name, description, size, price, stock, image } = product;
    const [result] = await connection.query(
        'INSERT INTO products (name, description, size, price, stock, image) VALUES (?, ?, ?, ?, ?, ?)',
        [name, description, size, price, stock, image]
    );
    return result;
};

export const updateProduct = async (id: number, product: Product): Promise<any> => {
    const { name, description, size, price, stock, image } = product;
    const [result] = await connection.query(
        'UPDATE products SET name = ?, description = ?, size = ?, price = ?, stock = ?, image = ? WHERE id = ?',
        [name, description, size, price, stock, image, id]
    );
    return result;
};

export const deleteProduct = async (id: number): Promise<any> => {
    const [result] = await connection.query('DELETE FROM products WHERE id = ?', [id]);
    return result;
};
