import db from '../db/connection';

export const createProduct = async (name: string, description: string, size: string, price: number, stock: number) => {
    const [result] = await db.query(
        'INSERT INTO products (name, description, size, price, stock) VALUES (?, ?, ?, ?, ?)',
        [name, description, size, price, stock]
    );
    return result;
};

export const getProducts = async () => {
    const [rows] = await db.query('SELECT * FROM products');
    return rows;
};

export const getProduct = async (id: number) => {
    const [rows] = await db.query<any[]>('SELECT * FROM products WHERE id = ?', [id]);
    if (rows.length === 0) {
        throw new Error('Producto no encontrado');
    }
    return rows[0];
};

export const updateProduct = async (id: number, name: string, description: string, size: string, price: number, stock: number) => {
    const [result] = await db.query(
        'UPDATE products SET name = ?, description = ?, size = ?, price = ?, stock = ? WHERE id = ?',
        [name, description, size, price, stock, id]
    );
    return result;
};

export const deleteProduct = async (id: number) => {
    const [result] = await db.query('DELETE FROM products WHERE id = ?', [id]);
    return result;
};
