import { Router } from 'express';
import { getExperiences, createExperience, updateExperience, deleteExperience } from '../controllers/experienceController';
import { authenticateAdmin } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

router.get('/', getExperiences);
router.post('/', authenticateAdmin, upload.single('image'), createExperience);
router.put('/:id', authenticateAdmin, upload.single('image'), updateExperience);
router.delete('/:id', authenticateAdmin, deleteExperience);

export default router;
