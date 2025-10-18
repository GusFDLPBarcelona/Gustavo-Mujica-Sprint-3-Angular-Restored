"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProject = exports.updateProject = exports.createProject = exports.getProject = exports.getProjects = void 0;
const firebase_1 = __importDefault(require("../db/firebase"));
const PROJECTS_COLLECTION = 'projects';
// Obtener todos los proyectos
const getProjects = async () => {
    const snapshot = await firebase_1.default.collection(PROJECTS_COLLECTION).orderBy('title').get();
    if (snapshot.empty) {
        return [];
    }
    const projects = [];
    snapshot.forEach(doc => {
        projects.push({ id: doc.id, ...doc.data() });
    });
    return projects;
};
exports.getProjects = getProjects;
// Obtener un proyecto específico por ID
const getProject = async (id) => {
    const docRef = firebase_1.default.collection(PROJECTS_COLLECTION).doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
        return null;
    }
    return { id: doc.id, ...doc.data() };
};
exports.getProject = getProject;
// Crear un nuevo proyecto
const createProject = async (project) => {
    const docRef = await firebase_1.default.collection(PROJECTS_COLLECTION).add(project);
    return { id: docRef.id, ...project };
};
exports.createProject = createProject;
// Actualizar un proyecto existente
const updateProject = async (id, project) => {
    const docRef = firebase_1.default.collection(PROJECTS_COLLECTION).doc(id);
    await docRef.update(project);
    const updatedDoc = await docRef.get();
    if (!updatedDoc.exists) {
        return null;
    }
    return { id: updatedDoc.id, ...updatedDoc.data() };
};
exports.updateProject = updateProject;
// Eliminar un proyecto
const deleteProject = async (id) => {
    await firebase_1.default.collection(PROJECTS_COLLECTION).doc(id).delete();
    return { msg: 'Proyecto eliminado con éxito' };
};
exports.deleteProject = deleteProject;
//# sourceMappingURL=project.js.map