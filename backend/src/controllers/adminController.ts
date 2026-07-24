import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';

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
      process.env.JWT_SECRET || 'supersecret_jwt_key_please_change',
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

    const hashedPassword = await bcrypt.hash('admin123', 10);
    const newAdmin = await prisma.admin.create({
      data: {
        username: 'admin',
        password: hashedPassword
      }
    });

    res.status(201).json({ message: 'Admin default berhasil dibuat', username: newAdmin.username });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};
