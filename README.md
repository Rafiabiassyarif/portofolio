# Fullstack Portfolio Web Application

Aplikasi web portofolio interaktif dan modern dengan dashboard admin, dibangun menggunakan **React 19, TypeScript, Vite, Tailwind CSS** pada frontend, serta **Node.js, Express, TypeScript, dan Prisma (MySQL)** pada backend.

---

## 🚀 Fitur Utama

- **Hero & Profile Showcase**: Manajemen greeting multi-bahasa (ID/EN), foto profil, dan link sosial media.
- **Interactive 3D / Experience**: Komponen interaktif dengan Three.js / OGL dan animasi modern.
- **Projects & Certifications**: Portofolio karya dan sertifikasi lengkap dengan manajemen gambar.
- **Custom Dynamic Sections**: Pembuatan section custom sesuai kebutuhan.
- **Admin Dashboard**: Panel kontrol penuh untuk mengubah konten portofolio secara real-time.
- **Face-API Integration**: Deteksi wajah webcam menggunakan model TensorFlow/face-api.

---

## 🛠️ Persyaratan Sistem

- **Node.js** >= 18.x / 20.x
- **MySQL** >= 8.0 / MariaDB
- **npm** atau **pnpm**

---

## ⚙️ Menjalankan di Lokal (Development)

### 1. Setup Backend
Masuk ke direktori `backend`:
```bash
cd backend
npm install
```

Salin file environment:
```bash
cp .env.example .env
```
Sesuaikan konfigurasi database dan rahasia JWT di `backend/.env`:
```env
DATABASE_URL="mysql://root:@localhost:3306/portfolio_db"
JWT_SECRET="rahasia_jwt_acak_lokal"
PORT=5000
```

Jalankan migrasi database dan generate Prisma client:
```bash
npm run db:push
npm run db:generate
```

(Opsional) Buat akun admin default:
```bash
npm run seed:admin
```
*Default: username `admin`, password `admin123` (bisa disesuaikan via argumen CLI: `npm run seed:admin <username> <password>`).*

Jalankan server backend:
```bash
npm run dev
```

### 2. Setup Frontend
Dari root direktori project:
```bash
npm install
```

Jalankan frontend dalam mode development:
```bash
npm run dev
# atau menjalankan backend + frontend bersamaan dari root:
npm start
```
Buka browser di `http://localhost:3000`.

---

## 🌐 Panduan Deploy ke Server / VPS

### 1. Build Frontend
Pastikan environment API base URL sudah diatur (untuk reverse proxy Nginx pada satu domain, gunakan `/api`):
```bash
VITE_API_URL=/api npm run build
```
Hasil build statis akan tersimpan di folder `dist/`.

### 2. Jalankan Backend dengan Process Manager (PM2)
Di server VPS / Minibox:
```bash
cd backend
npm install --production=false
npx prisma generate
npx prisma migrate deploy

# Jalankan dengan PM2 di port bebas (misal PORT=5001)
PORT=5001 NODE_ENV=production pm2 start "npx tsx src/server.ts" --name "portfolio-api"
```

### 3. Konfigurasi Nginx
Gunakan konfigurasi reverse proxy Nginx (satu domain):
- `location /` mengarah ke folder `dist/` dengan fallback `try_files $uri $uri/ /index.html;` (SPA).
- `location /api/` proxy ke `http://127.0.0.1:5001`.
- `location /uploads/` proxy ke `http://127.0.0.1:5001/uploads/`.
- Pastikan HTTPS aktif agar fitur webcam / face-api dapat berjalan.
