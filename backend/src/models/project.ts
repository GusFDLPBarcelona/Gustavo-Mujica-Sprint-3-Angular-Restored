import db from '../db/connection';

export const createProject = async (title: string, client: string, category: string, image: string) => {
    const [result] = await db.query(
        'INSERT INTO projects (title, client, category, image) VALUES (?, ?, ?, ?)',
        [title, client, category, image]
    );
    return result;
};

export const getProjects = async () => {
    try {
        const [rows] = await db.query('SELECT * FROM projects ORDER BY id'); 
        return rows; 
    } catch (error) {
        console.error('Error al obtener proyectos desde la base de datos:', error); 
        throw new Error('Error al obtener proyectos desde la base de datos'); 
    }
    
};

export const getProject = async (id: number) => {
    const [rows] = await db.query<any[]>('SELECT * FROM projects WHERE id = ?', [id]);
    if (rows.length === 0) {
        throw new Error('Proyecto no encontrado');
    }
    return rows[0];
};

export const updateProject = async (id: number, title: string, client: string, category: string, image: string) => {
    const [result] = await db.query(
        'UPDATE projects SET title = ?, client = ?, category = ?, image = ? WHERE id = ?',
        [title, client, category, image, id]
    );
    return result;
};

export const deleteProject = async (id: number) => {
    const [result] = await db.query('DELETE FROM projects WHERE id = ?', [id]);
    return result;
};
