import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { saveMedia, deleteMedia } from '../services/mediaService';

export const getHero = async (req: Request, res: Response) => {
  try {
    const hero = await prisma.heroContent.findFirst();
    res.json(hero);
  } catch {
    res.status(500).json({ message: 'Error fetching hero content' });
  }
};

export const updateHero = async (req: Request, res: Response): Promise<any> => {
  try {
    const { 
      greetingId, 
      greetingEn, 
      name, 
      titleId, 
      titleEn, 
      descriptionId, 
      descriptionEn, 
      instagramUrl, 
      linkedinUrl, 
      githubUrl, 
      resumeUrl: inputResumeUrl,
      removeProfileImg, 
      removeResume 
    } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    
    let existing = await prisma.heroContent.findFirst();
    if (!existing) return res.status(404).json({ message: 'Hero content not found' });
    
    let profileImgUrl = existing.profileImgUrl;
    let resumeUrl = existing.resumeUrl;

    if (files && files['profileImg'] && files['profileImg'][0]) {
      await deleteMedia(existing.profileImgUrl);
      profileImgUrl = await saveMedia(files['profileImg'][0]);
    } else if (removeProfileImg === 'true' || removeProfileImg === true) {
      await deleteMedia(existing.profileImgUrl);
      profileImgUrl = null;
    }

    if (files && files['resume'] && files['resume'][0]) {
      await deleteMedia(existing.resumeUrl);
      resumeUrl = await saveMedia(files['resume'][0]);
    } else if (removeResume === 'true' || removeResume === true) {
      await deleteMedia(existing.resumeUrl);
      resumeUrl = null;
    } else if (inputResumeUrl !== undefined) {
      resumeUrl = inputResumeUrl ? inputResumeUrl.trim() : null;
    }

    const data = { 
      greetingId: greetingId !== undefined ? (greetingId || greetingEn || existing.greetingId) : existing.greetingId, 
      greetingEn: greetingEn !== undefined ? (greetingEn || greetingId || existing.greetingEn) : existing.greetingEn, 
      name: name !== undefined ? name : existing.name, 
      titleId: titleId !== undefined ? (titleId || titleEn || existing.titleId) : existing.titleId, 
      titleEn: titleEn !== undefined ? (titleEn || titleId || existing.titleEn) : existing.titleEn, 
      descriptionId: descriptionId !== undefined ? (descriptionId || descriptionEn || existing.descriptionId) : existing.descriptionId, 
      descriptionEn: descriptionEn !== undefined ? (descriptionEn || descriptionId || existing.descriptionEn) : existing.descriptionEn, 
      instagramUrl: instagramUrl !== undefined ? (instagramUrl ? instagramUrl.trim() : null) : existing.instagramUrl, 
      linkedinUrl: linkedinUrl !== undefined ? (linkedinUrl ? linkedinUrl.trim() : null) : existing.linkedinUrl, 
      githubUrl: githubUrl !== undefined ? (githubUrl ? githubUrl.trim() : null) : existing.githubUrl, 
      resumeUrl, 
      profileImgUrl 
    };
    const updated = await prisma.heroContent.update({ where: { id: existing.id }, data });

    res.json(updated);
  } catch (error) {
    console.error('Error updating hero content:', error);
    res.status(500).json({ message: 'Error updating hero content' });
  }
};

export const upsertHero = async (req: Request, res: Response): Promise<any> => {
  try {
    const { greetingId, greetingEn, name, titleId, titleEn, descriptionId, descriptionEn, resumeUrl, removeProfileImg } = req.body;
    const existing = await prisma.heroContent.findFirst();
    let profileImgUrl = existing?.profileImgUrl || null;

    if (req.file) {
      if (existing?.profileImgUrl) await deleteMedia(existing.profileImgUrl);
      profileImgUrl = await saveMedia(req.file);
    } else if (removeProfileImg === 'true' || removeProfileImg === true) {
      if (existing?.profileImgUrl) await deleteMedia(existing.profileImgUrl);
      profileImgUrl = null;
    }

    const data = { greetingId, greetingEn, name, titleId, titleEn, descriptionId, descriptionEn, resumeUrl, profileImgUrl };
    const hero = existing
      ? await prisma.heroContent.update({ where: { id: existing.id }, data })
      : await prisma.heroContent.create({ data });

    res.json(hero);
  } catch (error) {
    console.error('Error upserting hero content:', error);
    res.status(500).json({ message: 'Error upserting hero content' });
  }
};
