import { Router } from 'express';
import { getHero, upsertHero } from '../controllers/heroController';
import { authenticateAdmin } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

router.get('/', getHero);
router.put('/', authenticateAdmin, upload.single('profileImg'), upsertHero);

export default router;
