import { Request, Response } from 'express';
import { createProject, getProjects, getProject, updateProject, deleteProject } from '../models/project';

export const getAllProjects = async (req: Request, res: Response) => {
    try {
        const projects = await getProjects();
        res.json(projects);
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener los proyectos', error });
    }
};

export const getOneProject = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const project = await getProject(Number(id));
        res.json(project);
    } catch (error) {
        res.status(404).json({ msg: 'Proyecto no encontrado', error });
    }
};

export const createProjectController = async (req: Request, res: Response) => {
    const { title, client, category, image } = req.body;

    if (!title || title.length < 3) {
        return res.status(400).json({ msg: 'El título es obligatorio y debe tener al menos 3 caracteres.' });
    }
    if (!client || client.length < 3) {
        return res.status(400).json({ msg: 'El cliente es obligatorio y debe tener al menos 3 caracteres.' });
    }
    if (!category) {
        return res.status(400).json({ msg: 'La categoría es obligatoria.' });
    }
    if (!image || !image.startsWith('http')) {
        return res.status(400).json({ msg: 'La imagen es obligatoria y debe ser una URL válida.' });
    }

    try {
        const result = await createProject(title, client, category, image);
        res.status(201).json({ msg: 'Proyecto creado', result });
    } catch (error) {
        res.status(500).json({ msg: 'Error al crear el proyecto', error });
    }
};


export const updateProjectController = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, client, category, image } = req.body;

    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ msg: 'El ID del proyecto es obligatorio y debe ser un número válido.' });
    }
    if (title && (typeof title !== 'string' || title.length < 3)) {
        return res.status(400).json({ msg: 'Si se proporciona, el título debe ser una cadena de al menos 3 caracteres.' });
    }
    if (client && (typeof client !== 'string' || client.length < 3)) {
        return res.status(400).json({ msg: 'Si se proporciona, el cliente debe ser una cadena de al menos 3 caracteres.' });
    }
    if (category && typeof category !== 'string') {
        return res.status(400).json({ msg: 'Si se proporciona, la categoría debe ser válida.' });
    }
    if (image && (typeof image !== 'string' || !image.startsWith('http'))) {
        return res.status(400).json({ msg: 'Si se proporciona, la imagen debe ser una URL válida.' });
    }

    try {
        const result = await updateProject(Number(id), title, client, category, image);
        res.json({ msg: 'Proyecto actualizado', result });
    } catch (error) {
        res.status(500).json({ msg: 'Error al actualizar el proyecto', error });
    }
};

export const deleteProjectController = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await deleteProject(Number(id));
        res.json({ msg: 'Proyecto eliminado', result });
    } catch (error) {
        res.status(500).json({ msg: 'Error al eliminar el proyecto', error });
    }
};
