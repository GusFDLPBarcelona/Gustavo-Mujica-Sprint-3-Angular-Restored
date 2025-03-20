import connection from '../db/connection';
import { Product } from '../interfaces/product.backend';
import { RowDataPacket } from 'mysql2';

// Obtener todos los productos con sus variantes
export const getProducts = async (): Promise<Product[]> => {
    const query = `
        SELECT 
            p.id, p.name, p.description, p.image, p.price,
            COALESCE(CONCAT('[', GROUP_CONCAT(DISTINCT JSON_OBJECT('id', s.id, 'size', s.size, 'stock', pv.stock) SEPARATOR ','), ']'), '[]') AS sizes,
            COALESCE(CONCAT('[', GROUP_CONCAT(DISTINCT JSON_OBJECT('id', c.id, 'color', c.color) SEPARATOR ','), ']'), '[]') AS colors,
            COALESCE(CONCAT('[', GROUP_CONCAT(DISTINCT JSON_QUOTE(ai.image_url) SEPARATOR ','), ']'), '[]') AS images
        FROM products p
        LEFT JOIN product_variants pv ON p.id = pv.product_id
        LEFT JOIN sizes s ON pv.size_id = s.id
        LEFT JOIN colors c ON pv.color_id = c.id
        LEFT JOIN product_images pi ON p.id = pi.product_id
        LEFT JOIN additional_images ai ON pi.image_id = ai.id
        GROUP BY p.id;
    `;
    const [rows] = await connection.query<RowDataPacket[]>(query);

    return rows.map(row => {
        console.log('Raw Row:', row);
        return {
            id: row.id,
            name: row.name,
            description: row.description,
            image: row.image,
            sizes: JSON.parse(row.sizes || '[]'),
            colors: JSON.parse(row.colors || '[]'),
            price: row.price,
            images: JSON.parse(row.images || '[]')
        };
    }) as Product[];
};

// Obtener un producto específico con todas sus variantes e imágenes adicionales
export const getProductById = async (id: number): Promise<Product | null> => {
    const query = `
        SELECT 
            p.id, p.name, p.description, p.image, p.price,
            c.id AS category_id, c.name AS category_name,
            COALESCE(CONCAT('[', GROUP_CONCAT(DISTINCT JSON_OBJECT('id', s.id, 'size', s.size, 'stock', pv.stock) SEPARATOR ','), ']'), '[]') AS sizes,
            COALESCE(CONCAT('[', GROUP_CONCAT(DISTINCT JSON_OBJECT('id', c2.id, 'color', c2.color) SEPARATOR ','), ']'), '[]') AS colors,
            COALESCE(CONCAT('[', GROUP_CONCAT(DISTINCT JSON_QUOTE(ai.image_url) SEPARATOR ','), ']'), '[]') AS images
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN product_variants pv ON p.id = pv.product_id
        LEFT JOIN sizes s ON pv.size_id = s.id
        LEFT JOIN colors c2 ON pv.color_id = c2.id
        LEFT JOIN product_images pi ON p.id = pi.product_id
        LEFT JOIN additional_images ai ON pi.image_id = ai.id
        WHERE p.id = ?
        GROUP BY p.id;
    `;
    const [rows] = await connection.query<RowDataPacket[]>(query, [id]);
    if (!rows.length) return null;

    console.log('Raw Row:', rows[0]);
    return {
        id: rows[0].id,
        name: rows[0].name,
        description: rows[0].description,
        image: rows[0].image,
        price: rows[0].price,
        category: rows[0].category_id ? { id: rows[0].category_id, name: rows[0].category_name } 
        : { id: 0, name: 'Uncategorized' },
        sizes: JSON.parse(rows[0].sizes || '[]'),
        colors: JSON.parse(rows[0].colors || '[]'),
        images: JSON.parse(rows[0].images || '[]')
    };
};

// Crear un producto con variantes
export const createProduct = async (product: Product): Promise<any> => {
    const { name, description, image, sizes, colors, price } = product;
    const [productResult]: any = await connection.query(
        'INSERT INTO products (name, description, image, price) VALUES (?, ?, ?, ?)',
        [name, description, image, price]
    );
    const productId = productResult.insertId;

    for (const size of sizes || []) {
        for (const color of colors || []) {
            await connection.query(
                'INSERT INTO product_variants (product_id, size_id, color_id, stock) VALUES (?, ?, ?, ?)',
                [productId, size.id, color.id, size.stock]
            );
        }
    }
    return { productId };
};

export const updateProduct = async (id: number, product: Product): Promise<any> => {
    const { name, description, image, sizes, colors, price } = product;
    
    // Actualizar los datos del producto base
    await connection.query(
        'UPDATE products SET name = ?, description = ?, image = ?, price = ? WHERE id = ?',
        [name, description, image, price, id]
    );

    // Eliminar variantes anteriores para evitar inconsistencias
    await connection.query('DELETE FROM product_variants WHERE product_id = ?', [id]);

    // Insertar nuevas variantes
    for (const size of sizes || []) {
        for (const color of colors || []) {
            await connection.query(
                'INSERT INTO product_variants (product_id, size_id, color_id, stock) VALUES (?, ?, ?, ?)',
                [id, size.id, color.id, size.stock]
            );
        }
    }

    return { msg: 'Producto actualizado con éxito', product };
};

// Eliminar un producto y sus variantes
export const deleteProduct = async (id: number): Promise<any> => {
    await connection.query('DELETE FROM products WHERE id = ?', [id]);
    return { msg: 'Producto eliminado con éxito' };
};
