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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

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
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
