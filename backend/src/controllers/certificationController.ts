import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { saveMedia, deleteMedia } from '../services/mediaService';

export const getCertifications = async (req: Request, res: Response) => {
  try {
    const certs = await prisma.certification.findMany({ orderBy: { order: 'asc' } });
    res.json(certs);
  } catch {
    res.status(500).json({ message: 'Error fetching certifications' });
  }
};

export const createCertification = async (req: Request, res: Response): Promise<any> => {
  try {
    const { titleId, titleEn, issuerId, issuerEn, dateId, dateEn, credentialUrl, order, isVisible } = req.body;
    const imageUrl = req.file ? await saveMedia(req.file) : null;
    const cert = await prisma.certification.create({
      data: { 
        titleId: (titleId || titleEn || '').trim(), 
        titleEn: (titleEn || titleId || '').trim(), 
        issuerId: (issuerId || issuerEn || '').trim(), 
        issuerEn: (issuerEn || issuerId || '').trim(), 
        dateId: (dateId || dateEn || '').trim(), 
        dateEn: (dateEn || dateId || '').trim(), 
        credentialUrl, 
        imageUrl, 
        order: order ? parseInt(order) : 0, 
        isVisible: isVisible !== undefined ? isVisible === 'true' || isVisible === true : true 
      }
    });
    res.status(201).json(cert);
  } catch (error) {
    console.error('Error creating certification:', error);
    res.status(500).json({ message: 'Error creating certification' });
  }
};

export const updateCertification = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { titleId, titleEn, issuerId, issuerEn, dateId, dateEn, credentialUrl, order, isVisible, removeImage } = req.body;
    const existing = await prisma.certification.findUnique({ where: { id: parseInt(id as string) } });
    if (!existing) return res.status(404).json({ message: 'Certification not found' });

    let imageUrl = existing.imageUrl;
    if (req.file) {
      await deleteMedia(existing.imageUrl);
      imageUrl = await saveMedia(req.file);
    } else if (removeImage === 'true' || removeImage === true) {
      await deleteMedia(existing.imageUrl);
      imageUrl = null;
    }

    const cert = await prisma.certification.update({
      where: { id: parseInt(id as string) },
      data: { 
        titleId: titleId !== undefined ? (titleId || titleEn || existing.titleId) : existing.titleId, 
        titleEn: titleEn !== undefined ? (titleEn || titleId || existing.titleEn) : existing.titleEn, 
        issuerId: issuerId !== undefined ? (issuerId || issuerEn || existing.issuerId) : existing.issuerId, 
        issuerEn: issuerEn !== undefined ? (issuerEn || issuerId || existing.issuerEn) : existing.issuerEn, 
        dateId: dateId !== undefined ? (dateId || dateEn || existing.dateId) : existing.dateId, 
        dateEn: dateEn !== undefined ? (dateEn || dateId || existing.dateEn) : existing.dateEn, 
        credentialUrl, 
        imageUrl, 
        order: order !== undefined ? parseInt(order) : existing.order, 
        isVisible: isVisible !== undefined ? isVisible === 'true' || isVisible === true : existing.isVisible 
      }
    });
    res.json(cert);
  } catch (error) {
    console.error('Error updating certification:', error);
    res.status(500).json({ message: 'Error updating certification' });
  }
};

export const deleteCertification = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const cert = await prisma.certification.findUnique({ where: { id: parseInt(id as string) } });
    if (!cert) return res.status(404).json({ message: 'Not found' });
    await deleteMedia(cert.imageUrl);
    await prisma.certification.delete({ where: { id: parseInt(id as string) } });
    res.json({ message: 'Certification deleted' });
  } catch (error) {
    console.error('Error deleting certification:', error);
    res.status(500).json({ message: 'Error deleting certification' });
  }
};
