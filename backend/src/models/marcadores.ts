import db from '../db/connection';


export const getMarkers = async () => {
    const [rows] = await db.query('SELECT * FROM marcadores');
    return rows;
};


const markerExists = async (latitude: number, longitude: number): Promise<boolean> => {
    const [rows]: any = await db.query(
        'SELECT COUNT(*) as count FROM marcadores WHERE latitude = ? AND longitude = ?',
        [latitude, longitude]
    );
    return rows[0].count > 0;
};

export const addMarker = async (latitude: number, longitude: number, name: string) => {

    const exists = await markerExists(latitude, longitude);
    if (exists) {
        throw new Error('El marcador ya existe en la base de datos');
    }


    const [result] = await db.query(
        'INSERT INTO marcadores (latitude, longitude, name) VALUES (?, ?, ?)',
        [latitude, longitude, name]
    );
    return result;
};


export const deleteMarker = async (id: number) => {
    const [result] = await db.query('DELETE FROM marcadores WHERE id = ?', [id]);
    return result;
};
