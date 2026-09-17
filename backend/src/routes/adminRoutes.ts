import { Router } from 'express';
import { login, createInitialAdmin, changePassword } from '../controllers/adminController';
import { authenticateAdmin } from '../middleware/auth';

const router = Router();

router.post('/login', login);
router.post('/setup', createInitialAdmin);
router.post('/change-password', authenticateAdmin, changePassword);

export default router;

