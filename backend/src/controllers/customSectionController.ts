import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getCustomSections = async (req: Request, res: Response) => {
  try {
    const sections = await prisma.customSection.findMany({
      orderBy: { order: 'asc' }
    });
    res.json(sections);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching custom sections', error });
  }
};

export const createCustomSection = async (req: Request, res: Response): Promise<any> => {
  try {
    const { slug, navLabelId, navLabelEn, titleId, titleEn, contentId, contentEn, icon, order, isVisible } = req.body;
    
    // Convert boolean if passed as string
    const visible = isVisible === 'false' || isVisible === false ? false : true;

    const section = await prisma.customSection.create({
      data: {
        slug: slug.toLowerCase().replace(/\s+/g, '-'), // auto slugify
        navLabelId,
        navLabelEn,
        titleId,
        titleEn,
        contentId,
        contentEn,
        icon,
        order: order ? parseInt(order.toString()) : 0,
        isVisible: visible
      }
    });
    res.status(201).json(section);
  } catch (error) {
    res.status(500).json({ message: 'Error creating custom section', error });
  }
};

export const updateCustomSection = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { slug, navLabelId, navLabelEn, titleId, titleEn, contentId, contentEn, icon, order, isVisible } = req.body;

    const updateData: any = {
      navLabelId,
      navLabelEn,
      titleId,
      titleEn,
      contentId,
      contentEn,
      icon,
    };

    if (slug) updateData.slug = slug.toLowerCase().replace(/\s+/g, '-');
    if (order !== undefined) updateData.order = parseInt(order.toString());
    if (isVisible !== undefined) updateData.isVisible = isVisible === 'false' || isVisible === false ? false : true;

    const section = await prisma.customSection.update({
      where: { id: parseInt(id as string) },
      data: updateData
    });
    res.json(section);
  } catch (error) {
    res.status(500).json({ message: 'Error updating custom section', error });
  }
};

export const deleteCustomSection = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    await prisma.customSection.delete({ where: { id: parseInt(id as string) } });
    res.json({ message: 'Custom section deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting custom section', error });
  }
};
