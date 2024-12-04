import db from '../db/connection';


export const getGraficos = async () => {
    const [rows] = await db.query('SELECT * FROM graficos');
    return rows;
};


export const addGrafico = async (producto: string, mes: number, anio: number, ventas: number) => {
    const [result] = await db.query(
        'INSERT INTO graficos (producto, mes, anio, ventas) VALUES (?, ?, ?, ?)',
        [producto, mes, anio, ventas]
    );
    return result;
};


export const deleteGrafico = async (id: number) => {
    const [result] = await db.query('DELETE FROM graficos WHERE id = ?', [id]);
    return result;
};
