import { Router } from 'express';
import { login, createInitialAdmin } from '../controllers/adminController';

const router = Router();

router.post('/login', login);
router.post('/setup', createInitialAdmin);

export default router;
