import { Router } from 'express';
import { authenticateAdmin } from '../middleware/auth';
import { upload } from '../middleware/upload';

import { saveMedia } from '../services/mediaService';

const router = Router();

router.post('/', authenticateAdmin, upload.single('image'), async (req, res): Promise<any> => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  try {
    const imageUrl = await saveMedia(req.file);
    res.json({ imageUrl });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error saving uploaded file' });
  }
});

export default router;
