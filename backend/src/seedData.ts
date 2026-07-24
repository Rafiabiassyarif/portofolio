import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with portfolio data...');

  // Seed Admin
  const bcrypt = require('bcryptjs');
  const existingAdmin = await prisma.admin.findFirst();
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.admin.create({
      data: {
        username: 'admin',
        password: hashedPassword
      }
    });
  }

  // Seed Hero
  await prisma.heroContent.upsert({
    where: { id: 1 },
    update: {},
    create: {
      greetingId: "Halo, saya",
      greetingEn: "Hi there, I am",
      name: "Rafi Abi Assyarif",
      titleId: "Pengembang Fullstack",
      titleEn: "Fullstack Developer",
      descriptionId: "Mahasiswa Diploma Sistem Informasi di Universitas Telkom. Membangun sistem web yang efisien, terukur, dan fungsional.",
      descriptionEn: "Diploma student in Information Systems at Telkom University. Building efficient, scalable, and functional web systems.",
    },
  });

  // Seed Experience
  const experiences = [
    {
      roleId: "Pengembang Mahasiswa",
      roleEn: "Student Developer",
      company: "Ko+Lab Telkom University",
      durationId: "Jan 2026 - Mei 2026",
      durationEn: "Jan 2026 - May 2026",
      descriptionId: "Mengembangkan layanan backend menggunakan Node.js. Integrasi API AI dengan layanan pihak ketiga. Memonitor performa sistem & pelacakan penggunaan. Manajemen basis data MySQL. Berkolaborasi dalam tim pengembangan startup Kroombox.",
      descriptionEn: "Developing backend services using Node.js. Integrating AI APIs with third-party services. System performance monitoring & usage tracking. MySQL database management. Collaborating in the Kroombox startup development team.",
      order: 1
    }
  ];

  for (const exp of experiences) {
    const exists = await prisma.experience.findFirst({ where: { roleId: exp.roleId, company: exp.company } });
    if (!exists) {
      await prisma.experience.create({ data: exp });
    }
  }

  // Seed Projects
  const projects = [
    {
      titleId: "KroomBridge",
      titleEn: "KroomBridge",
      descriptionId: "Platform integrator AI API untuk Kroombox Environment yang memungkinkan pengelolaan layanan AI secara terpusat dengan monitoring real-time, token management, dan billing tracking.",
      descriptionEn: "AI API Integrator Platform for Kroombox Environment that enables centralized management of AI services with real-time monitoring, token management, and billing tracking.",
      githubUrl: "https://github.com",
      demoUrl: "https://demo.com",
      tags: "React,Node.js,MySQL,Prisma,Tailwind CSS",
      order: 1
    },
    {
      titleId: "FlowFinance",
      titleEn: "FlowFinance",
      descriptionId: "Aplikasi pengelolaan keuangan pribadi dengan dashboard modern, visualisasi data, dan UI interaktif.",
      descriptionEn: "Personal finance management application with a modern dashboard, data visualization, and interactive UI.",
      githubUrl: "https://github.com",
      demoUrl: "https://demo.com",
      tags: "React,TypeScript,Tailwind CSS",
      order: 2
    }
  ];

  for (const proj of projects) {
    const exists = await prisma.project.findFirst({ where: { titleId: proj.titleId } });
    if (!exists) {
      await prisma.project.create({ data: proj });
    }
  }

  // Seed Skills
  const skills = [
    { name: "React", category: "Frontend", icon: "react", order: 1 },
    { name: "TypeScript", category: "Frontend", icon: "typescript", order: 2 },
    { name: "Tailwind CSS", category: "Frontend", icon: "tailwindcss", order: 3 },
    { name: "Node.js", category: "Backend", icon: "nodedotjs", order: 4 },
    { name: "Express", category: "Backend", icon: "express", order: 5 },
    { name: "MySQL", category: "Backend", icon: "mysql", order: 6 },
    { name: "Prisma", category: "Backend", icon: "prisma", order: 7 }
  ];

  for (const skill of skills) {
    const exists = await prisma.skill.findFirst({ where: { name: skill.name } });
    if (!exists) {
      await prisma.skill.create({ data: skill });
    }
  }

  // Seed Certifications
  const certs = [
    {
      titleId: "Oracle Academy",
      titleEn: "Oracle Academy",
      issuerId: "Desain Basis Data dan Pemrograman dengan SQL",
      issuerEn: "Database Design and Programming with SQL",
      dateId: "Skor: Premium",
      dateEn: "Score: Premium",
      order: 1
    },
    {
      titleId: "EPrT",
      titleEn: "EPrT",
      issuerId: "Tes Kemampuan Bahasa Inggris - Universitas Telkom",
      issuerEn: "English Proficiency Test - Telkom University",
      dateId: "Skor: Premium",
      dateEn: "Score: Premium",
      order: 2
    },
    {
      titleId: "Ko+Lab Telkom University",
      titleEn: "Ko+Lab Telkom University",
      issuerId: "Anggota Tim Startup Kroombox Research Alliance",
      issuerEn: "Kroombox Startup Team Member Research Alliance",
      dateId: "Mei 2026",
      dateEn: "May 2026",
      order: 3
    }
  ];

  for (const cert of certs) {
    const exists = await prisma.certification.findFirst({ where: { titleId: cert.titleId } });
    if (!exists) {
      await prisma.certification.create({ data: cert });
    }
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
