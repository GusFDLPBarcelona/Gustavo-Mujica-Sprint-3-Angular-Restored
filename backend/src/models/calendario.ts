import { RowDataPacket, ResultSetHeader } from 'mysql2';
import connection from '../db/connection';

export const getEventos = async () => {
    const [rows] = await connection.query<RowDataPacket[]>(`SELECT * FROM eventos`);

    return rows.map((evento: any) => ({
        ...evento,
        startDateTime: evento.startDateTime ? new Date(evento.startDateTime).toISOString() : null,
        endDateTime: evento.endDateTime ? new Date(evento.endDateTime).toISOString() : null,
    }));
};

export const createEvento = async (evento: any) => {
    const { summary, location, description, startDateTime, endDateTime } = evento;
    const [result] = await connection.query<ResultSetHeader>(
        `INSERT INTO eventos (summary, location, description, startDateTime, endDateTime) VALUES (?, ?, ?, ?, ?)`,
        [summary, location, description, startDateTime, endDateTime]
    );
    return result.insertId;
};

export const updateEvento = async (id: string, evento: any) => {
    const { summary, location, description, startDateTime, endDateTime } = evento;
    const [result] = await connection.query<ResultSetHeader>(
        `UPDATE eventos SET summary = ?, location = ?, description = ?, startDateTime = ?, endDateTime = ? WHERE id = ?`,
        [summary, location, description, startDateTime, endDateTime, id]
    );
    return result.affectedRows > 0;
};

export const deleteEvento = async (id: string) => {
    const [result] = await connection.query<ResultSetHeader>(
        `DELETE FROM eventos WHERE id = ?`,
        [id]
    );
    return result.affectedRows > 0;
};
