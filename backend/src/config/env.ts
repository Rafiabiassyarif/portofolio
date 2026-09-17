import dotenv from 'dotenv';
dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';
const envSecret = process.env.JWT_SECRET;
const DEFAULT_INSECURE_SECRET = 'supersecret_jwt_key_please_change';

// Validate JWT Secret in production
if (isProduction) {
  if (!envSecret || envSecret === DEFAULT_INSECURE_SECRET) {
    console.error('❌ [SECURITY ERROR] JWT_SECRET wajib di-set dengan secret yang aman di production!');
    console.error('❌ Jangan gunakan secret default "supersecret_jwt_key_please_change" di server publik.');
    throw new Error('JWT_SECRET must be configured securely in production.');
  }
} else {
  if (!envSecret || envSecret === DEFAULT_INSECURE_SECRET) {
    console.warn('⚠️ [DEV WARNING] Backend berjalan dengan JWT_SECRET default. Pastikan mengubah JWT_SECRET saat deploy ke production!');
  }
}

export const JWT_SECRET = envSecret || DEFAULT_INSECURE_SECRET;
export const PORT = Number(process.env.PORT) || 5000;
export const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';
export const ADMIN_SETUP_SECRET = process.env.ADMIN_SETUP_SECRET || '';
