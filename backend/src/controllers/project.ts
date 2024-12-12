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
