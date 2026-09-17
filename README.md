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

