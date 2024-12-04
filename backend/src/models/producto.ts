import db from '../db/connection';


export const createProducto = async (nombre: string, descripcion: string, talla: string, precio: number, stock: number) => {

    const [result] = await db.query(
        'INSERT INTO productos (nombre, descripcion, talla, precio, stock) VALUES (?, ?, ?, ?, ?)',
        [nombre, descripcion, talla, precio, stock]
    );
    return result;
};


export const getProductos = async () => {

    const [rows] = await db.query('SELECT * FROM productos');
    return rows;
};


export const getProducto = async (id: number) => {

    const [rows] = await db.query<any[]>('SELECT * FROM productos WHERE id = ?', [id]);

    if (rows.length === 0) {
        throw new Error('Producto no encontrado');
    }
    return rows[0];
};



export const updateProducto = async (id: number, nombre: string, descripcion: string, talla: string, precio: number, stock: number) => {

    const [result] = await db.query(
        'UPDATE productos SET nombre = ?, descripcion = ?, talla = ?, precio = ?, stock = ? WHERE id = ?',
        [nombre, descripcion, talla, precio, stock, id]
    );
    return result;
};


export const deleteProducto = async (id: number) => {
    const [result] = await db.query('DELETE FROM productos WHERE id = ?', [id]);
    return result;
};
