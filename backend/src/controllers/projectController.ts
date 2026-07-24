import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import fs from 'fs';
import path from 'path';

// Helper to delete old image
const deleteImage = (imageUrl: string | null) => {
  if (imageUrl) {
    const filename = imageUrl.split('/').pop();
    if (filename) {
      const filepath = path.join(__dirname, '../../uploads', filename);
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
    }
  }
};

export const getProjects = async (req: Request, res: Response) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { order: 'asc' }
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects' });
  }
};

export const createProject = async (req: Request, res: Response): Promise<any> => {
  try {
    const { titleId, titleEn, descriptionId, descriptionEn, githubUrl, demoUrl, tags, backgroundColor, order, isVisible } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const newProject = await prisma.project.create({
      data: {
        titleId,
        titleEn,
        descriptionId,
        descriptionEn,
        githubUrl,
        demoUrl,
        tags,
        backgroundColor,
        imageUrl,
        order: order ? parseInt(order) : 0,
        isVisible: isVisible !== undefined ? isVisible === 'true' || isVisible === true : true
      }
    });

    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ message: 'Error creating project' });
  }
};

export const updateProject = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { titleId, titleEn, descriptionId, descriptionEn, githubUrl, demoUrl, tags, backgroundColor, order, isVisible, removeImage } = req.body;
    
    const existingProject = await prisma.project.findUnique({ where: { id: parseInt(id as string) } });
    if (!existingProject) return res.status(404).json({ message: 'Project not found' });

    let imageUrl = existingProject.imageUrl;
    if (req.file) {
      deleteImage(existingProject.imageUrl);
      imageUrl = `/uploads/${req.file.filename}`;
    } else if (removeImage === 'true' || removeImage === true) {
      deleteImage(existingProject.imageUrl);
      imageUrl = null;
    }

    const updatedProject = await prisma.project.update({
      where: { id: parseInt(id as string) },
      data: {
        titleId,
        titleEn,
        descriptionId,
        descriptionEn,
        githubUrl,
        demoUrl,
        tags,
        imageUrl,
        backgroundColor,
        order: order !== undefined ? parseInt(order) : existingProject.order,
        isVisible: isVisible !== undefined ? isVisible === 'true' || isVisible === true : existingProject.isVisible
      }
    });

    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: 'Error updating project' });
  }
};

export const deleteProject = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const project = await prisma.project.findUnique({ where: { id: parseInt(id as string) } });
    
    if (!project) return res.status(404).json({ message: 'Project not found' });

    deleteImage(project.imageUrl);
    await prisma.project.delete({ where: { id: parseInt(id as string) } });

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting project' });
  }
};
