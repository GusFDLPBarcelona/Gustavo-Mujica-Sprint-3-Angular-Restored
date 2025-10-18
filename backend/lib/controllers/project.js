"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProjectController = exports.updateProjectController = exports.createProjectController = exports.getOneProject = exports.getAllProjects = void 0;
const project_1 = require("../models/project");
// Obtener todos los proyectos
const getAllProjects = async (req, res) => {
    try {
        const projects = await (0, project_1.getProjects)();
        res.status(200).json(projects);
    }
    catch (error) {
        console.error('Error al obtener proyectos:', error);
        res.status(500).json({ msg: 'Error al obtener proyectos', error });
    }
};
exports.getAllProjects = getAllProjects;
// Obtener un solo proyecto por ID
const getOneProject = async (req, res) => {
    const { id } = req.params;
    try {
        const project = await (0, project_1.getProject)(id);
        if (!project) {
            res.status(404).json({ msg: 'Proyecto no encontrado' });
        }
        else {
            res.status(200).json(project);
        }
    }
    catch (error) {
        console.error('Error al obtener proyecto:', error);
        res.status(500).json({ msg: 'Error al obtener proyecto', error });
    }
};
exports.getOneProject = getOneProject;
// Crear un nuevo proyecto
const createProjectController = async (req, res) => {
    try {
        const projectData = req.body;
        if (!projectData.title || !projectData.client || !projectData.category || !projectData.image) {
            res.status(400).json({ msg: 'Todos los campos son obligatorios' });
        }
        else {
            const newProject = await (0, project_1.createProject)(projectData);
            res.status(201).json({ msg: 'Proyecto creado con éxito', project: newProject });
        }
    }
    catch (error) {
        console.error('Error al crear proyecto:', error);
        res.status(500).json({ msg: 'Error al crear proyecto', error });
    }
};
exports.createProjectController = createProjectController;
// Actualizar un proyecto existente
const updateProjectController = async (req, res) => {
    const { id } = req.params;
    const projectData = req.body;
    try {
        const updatedProject = await (0, project_1.updateProject)(id, projectData);
        if (!updatedProject) {
            res.status(404).json({ msg: 'Proyecto no encontrado para actualizar' });
        }
        else {
            res.status(200).json({ msg: 'Proyecto actualizado con éxito', project: updatedProject });
        }
    }
    catch (error) {
        console.error('Error al actualizar proyecto:', error);
        res.status(500).json({ msg: 'Error al actualizar proyecto', error });
    }
};
exports.updateProjectController = updateProjectController;
// Eliminar un proyecto
const deleteProjectController = async (req, res) => {
    const { id } = req.params;
    try {
        await (0, project_1.deleteProject)(id);
        res.status(200).json({ msg: 'Proyecto eliminado con éxito' });
    }
    catch (error) {
        console.error('Error al eliminar proyecto:', error);
        res.status(500).json({ msg: 'Error al eliminar proyecto', error });
    }
};
exports.deleteProjectController = deleteProjectController;
//# sourceMappingURL=project.js.map