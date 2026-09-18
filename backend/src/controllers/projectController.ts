import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { saveMedia, deleteMedia } from '../services/mediaService';

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
    const imageUrl = req.file ? await saveMedia(req.file) : null;

    const newProject = await prisma.project.create({
      data: {
        titleId: (titleId || titleEn || '').trim(),
        titleEn: (titleEn || titleId || '').trim(),
        descriptionId: (descriptionId || descriptionEn || '').trim(),
        descriptionEn: (descriptionEn || descriptionId || '').trim(),
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
    console.error('Error creating project:', error);
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
      await deleteMedia(existingProject.imageUrl);
      imageUrl = await saveMedia(req.file);
    } else if (removeImage === 'true' || removeImage === true) {
      await deleteMedia(existingProject.imageUrl);
      imageUrl = null;
    }

    const updatedProject = await prisma.project.update({
      where: { id: parseInt(id as string) },
      data: {
        titleId: titleId !== undefined ? (titleId || titleEn || existingProject.titleId) : existingProject.titleId,
        titleEn: titleEn !== undefined ? (titleEn || titleId || existingProject.titleEn) : existingProject.titleEn,
        descriptionId: descriptionId !== undefined ? (descriptionId || descriptionEn || existingProject.descriptionId) : existingProject.descriptionId,
        descriptionEn: descriptionEn !== undefined ? (descriptionEn || descriptionId || existingProject.descriptionEn) : existingProject.descriptionEn,
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
    console.error('Error updating project:', error);
    res.status(500).json({ message: 'Error updating project' });
  }
};

export const deleteProject = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const project = await prisma.project.findUnique({ where: { id: parseInt(id as string) } });
    
    if (!project) return res.status(404).json({ message: 'Project not found' });

    await deleteMedia(project.imageUrl);
    await prisma.project.delete({ where: { id: parseInt(id as string) } });

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Error deleting project' });
  }
};
