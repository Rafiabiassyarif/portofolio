import prisma from '../lib/prisma';
import path from 'path';
import fs from 'fs';

const getMimeType = (filename: string): string => {
  const ext = path.extname(filename).toLowerCase();
  switch (ext) {
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.gif':
      return 'image/gif';
    case '.webp':
      return 'image/webp';
    case '.svg':
      return 'image/svg+xml';
    case '.ico':
      return 'image/x-icon';
    case '.pdf':
      return 'application/pdf';
    default:
      return 'application/octet-stream';
  }
};

export const saveMedia = async (file: Express.Multer.File): Promise<string> => {
  const ext = path.extname(file.originalname) || '.png';
  const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
  const mimeType = file.mimetype || getMimeType(file.originalname);

  await prisma.media.create({
    data: {
      filename,
      mimeType,
      data: file.buffer,
    },
  });

  return `/uploads/${filename}`;
};

export const getMedia = async (filename: string): Promise<{ data: Buffer; mimeType: string } | null> => {
  const media = await prisma.media.findUnique({
    where: { filename },
  });

  if (!media) return null;

  return {
    data: Buffer.from(media.data),
    mimeType: media.mimeType,
  };
};

export const deleteMedia = async (imageUrlOrFilename: string | null | undefined): Promise<void> => {
  if (!imageUrlOrFilename) return;
  const filename = imageUrlOrFilename.split('/').pop();
  if (!filename) return;

  try {
    await prisma.media.deleteMany({
      where: { filename },
    });
  } catch (error) {
    console.error(`[MediaService] Error deleting media from DB (${filename}):`, error);
  }

  // Also clean up from disk if an older copy still exists
  try {
    const diskPath = path.join(__dirname, '../../uploads', filename);
    if (fs.existsSync(diskPath)) {
      fs.unlinkSync(diskPath);
    }
  } catch (error) {
    console.error(`[MediaService] Error removing file from disk (${filename}):`, error);
  }
};

export const migrateDiskUploadsToDb = async (): Promise<number> => {
  const uploadDir = path.join(__dirname, '../../uploads');
  if (!fs.existsSync(uploadDir)) return 0;

  const files = fs.readdirSync(uploadDir);
  let migratedCount = 0;

  for (const filename of files) {
    if (filename === '.gitkeep' || filename.startsWith('.')) continue;

    const fullPath = path.join(uploadDir, filename);
    const stat = fs.statSync(fullPath);
    if (!stat.isFile()) continue;

    const existing = await prisma.media.findUnique({
      where: { filename },
    });

    if (!existing) {
      try {
        const data = fs.readFileSync(fullPath);
        const mimeType = getMimeType(filename);

        await prisma.media.create({
          data: {
            filename,
            mimeType,
            data,
          },
        });
        migratedCount++;
        console.log(`[MediaService] Migrated ${filename} to database (${(data.length / 1024).toFixed(1)} KB)`);
      } catch (err) {
        console.error(`[MediaService] Failed to migrate ${filename}:`, err);
      }
    }
  }

  if (migratedCount > 0) {
    console.log(`[MediaService] Total ${migratedCount} files migrated to database!`);
  }

  return migratedCount;
};
