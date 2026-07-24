import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import fs from 'fs';
import path from 'path';

const deleteImage = (imageUrl: string | null) => {
  if (imageUrl) {
    const filename = imageUrl.split('/').pop();
    if (filename) {
      const filepath = path.join(__dirname, '../../uploads', filename);
      if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
    }
  }
};

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
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const cert = await prisma.certification.create({
      data: { titleId, titleEn, issuerId, issuerEn, dateId, dateEn, credentialUrl, imageUrl, order: order ? parseInt(order) : 0, isVisible: isVisible !== undefined ? isVisible === 'true' || isVisible === true : true }
    });
    res.status(201).json(cert);
  } catch {
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
      deleteImage(existing.imageUrl);
      imageUrl = `/uploads/${req.file.filename}`;
    } else if (removeImage === 'true' || removeImage === true) {
      deleteImage(existing.imageUrl);
      imageUrl = null;
    }

    const cert = await prisma.certification.update({
      where: { id: parseInt(id as string) },
      data: { titleId, titleEn, issuerId, issuerEn, dateId, dateEn, credentialUrl, imageUrl, order: order !== undefined ? parseInt(order) : existing.order, isVisible: isVisible !== undefined ? isVisible === 'true' || isVisible === true : existing.isVisible }
    });
    res.json(cert);
  } catch {
    res.status(500).json({ message: 'Error updating certification' });
  }
};

export const deleteCertification = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const cert = await prisma.certification.findUnique({ where: { id: parseInt(id as string) } });
    if (!cert) return res.status(404).json({ message: 'Not found' });
    deleteImage(cert.imageUrl);
    await prisma.certification.delete({ where: { id: parseInt(id as string) } });
    res.json({ message: 'Certification deleted' });
  } catch {
    res.status(500).json({ message: 'Error deleting certification' });
  }
};
