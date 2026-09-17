import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma';
import dotenv from 'dotenv';
dotenv.config();

async function main() {
  const username = process.argv[2] || process.env.ADMIN_INIT_USERNAME || 'admin';
  const password = process.argv[3] || process.env.ADMIN_INIT_PASSWORD || 'admin123';

  console.log(`Setting up admin user: "${username}"...`);

  const existing = await prisma.admin.findUnique({ where: { username } });
  const hashedPassword = await bcrypt.hash(password, 10);

  if (existing) {
    await prisma.admin.update({
      where: { username },
      data: { password: hashedPassword }
    });
    console.log(`✅ Admin "${username}" berhasil diupdate dengan password baru.`);
  } else {
    await prisma.admin.create({
      data: { username, password: hashedPassword }
    });
    console.log(`✅ Admin "${username}" berhasil dibuat.`);
  }
}

main()
  .catch((e) => {
    console.error('❌ Error seeding admin:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
