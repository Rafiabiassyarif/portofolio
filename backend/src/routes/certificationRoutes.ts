import { Router } from 'express';
import { getCertifications, createCertification, updateCertification, deleteCertification } from '../controllers/certificationController';
import { authenticateAdmin } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

router.get('/', getCertifications);
router.post('/', authenticateAdmin, upload.single('image'), createCertification);
router.put('/:id', authenticateAdmin, upload.single('image'), updateCertification);
router.delete('/:id', authenticateAdmin, deleteCertification);

export default router;
