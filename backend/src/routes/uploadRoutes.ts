import { Router } from 'express';
import { authenticateAdmin } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

router.post('/', authenticateAdmin, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});

export default router;
