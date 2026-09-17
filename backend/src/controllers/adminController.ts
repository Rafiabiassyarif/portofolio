import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import { JWT_SECRET, ADMIN_SETUP_SECRET } from '../config/env';
import { AuthRequest } from '../middleware/auth';

export const login = async (req: Request, res: Response): Promise<any> => {
  const { username, password } = req.body;

  try {
    const admin = await prisma.admin.findUnique({
      where: { username }
    });

    if (!admin) {
      return res.status(401).json({ message: 'Username atau password salah' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Username atau password salah' });
    }

    const token = jwt.sign(
      { id: admin.id },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Login berhasil',
      token,
      admin: {
        id: admin.id,
        username: admin.username
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

export const createInitialAdmin = async (req: Request, res: Response): Promise<any> => {
  try {
    const existingAdmin = await prisma.admin.findFirst();
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin sudah ada!' });
    }

    // Optional setup secret guard if configured
    if (ADMIN_SETUP_SECRET) {
      const providedSecret = req.headers['x-setup-key'] || req.body?.setupKey;
      if (providedSecret !== ADMIN_SETUP_SECRET) {
        return res.status(403).json({ message: 'Akses ditolak: Setup key tidak valid.' });
      }
    }

    const username = req.body?.username || process.env.ADMIN_INIT_USERNAME || 'admin';
    const password = req.body?.password || process.env.ADMIN_INIT_PASSWORD || 'admin123';

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password minimal 6 karakter' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await prisma.admin.create({
      data: {
        username,
        password: hashedPassword
      }
    });

    res.status(201).json({ 
      message: 'Admin berhasil dibuat', 
      username: newAdmin.username 
    });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

export const changePassword = async (req: AuthRequest, res: Response): Promise<any> => {
  const { currentPassword, newPassword } = req.body;
  const adminId = req.adminId;

  if (!adminId) {
    return res.status(401).json({ message: 'Tidak terotentikasi' });
  }

  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ message: 'Password baru minimal 6 karakter' });
  }

  try {
    const admin = await prisma.admin.findUnique({
      where: { id: adminId }
    });

    if (!admin) {
      return res.status(404).json({ message: 'Admin tidak ditemukan' });
    }

    if (currentPassword) {
      const isMatch = await bcrypt.compare(currentPassword, admin.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Password lama tidak sesuai' });
      }
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.admin.update({
      where: { id: adminId },
      data: { password: hashedPassword }
    });

    res.json({ message: 'Password admin berhasil diperbarui' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

