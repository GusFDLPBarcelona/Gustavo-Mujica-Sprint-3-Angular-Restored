import db from '../db/firebase';
import { Project } from '../interfaces/project.backend';

const PROJECTS_COLLECTION = 'projects';

// Obtener todos los proyectos
export const getProjects = async (): Promise<Project[]> => {
    const snapshot = await db.collection(PROJECTS_COLLECTION).orderBy('title').get();
    if (snapshot.empty) {
        return [];
    }
    const projects: Project[] = [];
    snapshot.forEach(doc => {
        projects.push({ id: doc.id, ...doc.data() } as Project);
    });
    return projects;
};

// Obtener un proyecto específico por ID
export const getProject = async (id: string): Promise<Project | null> => {
    const docRef = db.collection(PROJECTS_COLLECTION).doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
        return null;
    }

    return { id: doc.id, ...doc.data() } as Project;
};

// Crear un nuevo proyecto
export const createProject = async (project: Omit<Project, 'id'>): Promise<Project> => {
    const docRef = await db.collection(PROJECTS_COLLECTION).add(project);
    return { id: docRef.id, ...project } as Project;
};

// Actualizar un proyecto existente
export const updateProject = async (id: string, project: Partial<Project>): Promise<Project | null> => {
    const docRef = db.collection(PROJECTS_COLLECTION).doc(id);
    await docRef.update(project);

    const updatedDoc = await docRef.get();
    if (!updatedDoc.exists) {
        return null;
    }
    return { id: updatedDoc.id, ...updatedDoc.data() } as Project;
};

// Eliminar un proyecto
export const deleteProject = async (id: string): Promise<{ msg: string }> => {
    await db.collection(PROJECTS_COLLECTION).doc(id).delete();
    return { msg: 'Proyecto eliminado con éxito' };
};
