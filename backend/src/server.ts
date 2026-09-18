import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import adminRoutes from './routes/adminRoutes';
import heroRoutes from './routes/heroRoutes';
import projectRoutes from './routes/projectRoutes';
import experienceRoutes from './routes/experienceRoutes';
import skillRoutes from './routes/skillRoutes';
import certificationRoutes from './routes/certificationRoutes';

import customSectionRoutes from './routes/customSectionRoutes';
import uploadRoutes from './routes/uploadRoutes';

import { PORT, CORS_ORIGIN } from './config/env';

const app = express();

const allowedOrigins = CORS_ORIGIN === '*' 
  ? '*' 
  : CORS_ORIGIN.split(',').map(o => o.trim());

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import fs from 'fs';
import { getMedia, migrateDiskUploadsToDb } from './services/mediaService';

// Serve uploaded files directly from MySQL database (with disk fallback)
app.get('/uploads/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const media = await getMedia(filename);

    if (media) {
      res.setHeader('Content-Type', media.mimeType || 'application/octet-stream');
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      return res.send(media.data);
    }

    // Disk fallback if file exists on filesystem
    const diskPath = path.join(__dirname, '../uploads', filename);
    if (fs.existsSync(diskPath)) {
      return res.sendFile(diskPath);
    }

    return res.status(404).json({ message: 'File not found' });
  } catch (error) {
    console.error('Error serving media file:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/hero', heroRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/experiences', experienceRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/certifications', certificationRoutes);
app.use('/api/custom-sections', customSectionRoutes);
app.use('/api/upload', uploadRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// Start server
app.listen(PORT, async () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  // Automatically migrate existing disk uploads to DB if any
  try {
    await migrateDiskUploadsToDb();
  } catch (err) {
    console.error('Disk upload migration check error:', err);
  }
});
