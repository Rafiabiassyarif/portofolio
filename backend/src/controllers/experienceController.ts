import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { saveMedia, deleteMedia } from '../services/mediaService';

export const getExperiences = async (req: Request, res: Response) => {
  try {
    const experiences = await prisma.experience.findMany({ orderBy: { order: 'asc' } });
    res.json(experiences);
  } catch {
    res.status(500).json({ message: 'Error fetching experiences' });
  }
};

export const createExperience = async (req: Request, res: Response): Promise<any> => {
  try {
    const { roleId, roleEn, company, durationId, durationEn, descriptionId, descriptionEn, order, isVisible } = req.body;
    const imageUrl = req.file ? await saveMedia(req.file) : null;

    const experience = await prisma.experience.create({
      data: { 
        roleId, roleEn, company, durationId, durationEn, descriptionId, descriptionEn, 
        imageUrl,
        order: order ? parseInt(order) : 0, 
        isVisible: isVisible !== undefined ? isVisible === 'true' || isVisible === true : true 
      }
    });
    res.status(201).json(experience);
  } catch (error) {
    console.error('Error creating experience:', error);
    res.status(500).json({ message: 'Error creating experience' });
  }
};

export const updateExperience = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { roleId, roleEn, company, durationId, durationEn, descriptionId, descriptionEn, order, isVisible, removeImage } = req.body;
    
    const existing = await prisma.experience.findUnique({ where: { id: parseInt(id as string) } });
    if (!existing) return res.status(404).json({ message: 'Experience not found' });

    let imageUrl = existing.imageUrl;
    if (req.file) {
      await deleteMedia(existing.imageUrl);
      imageUrl = await saveMedia(req.file);
    } else if (removeImage === 'true' || removeImage === true) {
      await deleteMedia(existing.imageUrl);
      imageUrl = null;
    }

    const experience = await prisma.experience.update({
      where: { id: parseInt(id as string) },
      data: { 
        roleId, roleEn, company, durationId, durationEn, descriptionId, descriptionEn, 
        imageUrl,
        order: order !== undefined ? parseInt(order) : existing.order, 
        isVisible: isVisible !== undefined ? isVisible === 'true' || isVisible === true : existing.isVisible 
      }
    });
    res.json(experience);
  } catch (error) {
    console.error('Error updating experience:', error);
    res.status(500).json({ message: 'Error updating experience' });
  }
};

export const deleteExperience = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const existing = await prisma.experience.findUnique({ where: { id: parseInt(id as string) } });
    if (existing) await deleteMedia(existing.imageUrl);

    await prisma.experience.delete({ where: { id: parseInt(id as string) } });
    res.json({ message: 'Experience deleted successfully' });
  } catch (error) {
    console.error('Error deleting experience:', error);
    res.status(500).json({ message: 'Error deleting experience' });
  }
};
