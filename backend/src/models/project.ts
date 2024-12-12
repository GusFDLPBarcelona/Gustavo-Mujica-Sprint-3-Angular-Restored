import db from '../db/connection';

export const createProject = async (title: string, client: string, category: string, image: string) => {
    const [result] = await db.query(
        'INSERT INTO projects (title, client, category, image) VALUES (?, ?, ?, ?)',
        [title, client, category, image]
    );
    return result;
};

export const getProjects = async () => {
    const [rows] = await db.query('SELECT * FROM projects');
    return rows;
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
