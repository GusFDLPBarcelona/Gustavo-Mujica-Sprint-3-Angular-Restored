import { Router } from 'express';
import { getAllProjects, getOneProject, createProjectController, updateProjectController, deleteProjectController } from '../controllers/project';

const router = Router();

router.get('/', getAllProjects);
router.get('/:id', getOneProject);
router.post('/', createProjectController);
router.put('/:id', updateProjectController);
router.delete('/:id', deleteProjectController);

export default router;
