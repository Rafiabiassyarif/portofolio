import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getSkills = async (req: Request, res: Response) => {
  try {
    const skills = await prisma.skill.findMany({ orderBy: { order: 'asc' } });
    res.json(skills);
  } catch {
    res.status(500).json({ message: 'Error fetching skills' });
  }
};

export const createSkill = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, icon, category, order, isVisible } = req.body;
    const skill = await prisma.skill.create({
      data: { name, icon, category: category || 'Frontend', order: order ? parseInt(order) : 0, isVisible: isVisible !== undefined ? isVisible : true }
    });
    res.status(201).json(skill);
  } catch {
    res.status(500).json({ message: 'Error creating skill' });
  }
};

export const updateSkill = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { name, icon, category, order, isVisible } = req.body;
    
    const existing = await prisma.skill.findUnique({ where: { id: parseInt(id as string) } });
    if (!existing) return res.status(404).json({ message: 'Skill not found' });
    
    const skill = await prisma.skill.update({
      where: { id: parseInt(id as string) },
      data: { name, icon, category, order: order !== undefined ? parseInt(order) : existing.order, isVisible: isVisible !== undefined ? isVisible : existing.isVisible }
    });
    res.json(skill);
  } catch {
    res.status(500).json({ message: 'Error updating skill' });
  }
};

export const deleteSkill = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    await prisma.skill.delete({ where: { id: parseInt(id as string) } });
    res.json({ message: 'Skill deleted successfully' });
  } catch {
    res.status(500).json({ message: 'Error deleting skill' });
  }
};
