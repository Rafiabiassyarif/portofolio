import { Router } from 'express';
import { getProjects, createProject, updateProject, deleteProject } from '../controllers/projectController';
import { authenticateAdmin } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

// Public route
router.get('/', getProjects);

// Protected routes (Admin only)
router.post('/', authenticateAdmin, upload.single('image'), createProject);
router.put('/:id', authenticateAdmin, upload.single('image'), updateProject);
router.delete('/:id', authenticateAdmin, deleteProject);

export default router;
