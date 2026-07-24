import express from 'express';
import { getCustomSections, createCustomSection, updateCustomSection, deleteCustomSection } from '../controllers/customSectionController';
import { authenticateAdmin } from '../middleware/auth';

const router = express.Router();

router.get('/', getCustomSections);
router.post('/', authenticateAdmin, createCustomSection);
router.put('/:id', authenticateAdmin, updateCustomSection);
router.delete('/:id', authenticateAdmin, deleteCustomSection);

export default router;
