import { Request, Response } from 'express';
import {
    createProject,
    getProjects,
    getProject,
    updateProject,
    deleteProject
} from '../models/project';
import { Project } from '../interfaces/project.backend';

// Obtener todos los proyectos
export const getAllProjects = async (req: Request, res: Response) => {
    try {
        const projects = await getProjects();
        res.status(200).json(projects);
    } catch (error) {
        console.error('Error al obtener proyectos:', error);
        res.status(500).json({ msg: 'Error al obtener proyectos', error });
    }
};

// Obtener un solo proyecto por ID
export const getOneProject = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const project = await getProject(id);
        if (!project) {
            res.status(404).json({ msg: 'Proyecto no encontrado' });
        } else {
            res.status(200).json(project);
        }
    } catch (error) {
        console.error('Error al obtener proyecto:', error);
        res.status(500).json({ msg: 'Error al obtener proyecto', error });
    }
};

// Crear un nuevo proyecto
export const createProjectController = async (req: Request, res: Response) => {
    try {
        const projectData: Omit<Project, 'id'> = req.body;
        if (!projectData.title || !projectData.client || !projectData.category || !projectData.image) {
            res.status(400).json({ msg: 'Todos los campos son obligatorios' });
        } else {
            const newProject = await createProject(projectData);
            res.status(201).json({ msg: 'Proyecto creado con éxito', project: newProject });
        }
    } catch (error) {
        console.error('Error al crear proyecto:', error);
        res.status(500).json({ msg: 'Error al crear proyecto', error });
    }
};

// Actualizar un proyecto existente
export const updateProjectController = async (req: Request, res: Response) => {
    const { id } = req.params;
    const projectData: Partial<Project> = req.body;

    try {
        const updatedProject = await updateProject(id, projectData);
        if (!updatedProject) {
            res.status(404).json({ msg: 'Proyecto no encontrado para actualizar' });
        } else {
            res.status(200).json({ msg: 'Proyecto actualizado con éxito', project: updatedProject });
        }
    } catch (error) {
        console.error('Error al actualizar proyecto:', error);
        res.status(500).json({ msg: 'Error al actualizar proyecto', error });
    }
};

// Eliminar un proyecto
export const deleteProjectController = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await deleteProject(id);
        res.status(200).json({ msg: 'Proyecto eliminado con éxito' });
    } catch (error) {
        console.error('Error al eliminar proyecto:', error);
        res.status(500).json({ msg: 'Error al eliminar proyecto', error });
    }
};
