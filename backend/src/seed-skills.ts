import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const skills = [
  { name: 'HTML, CSS, JavaScript, React.js, Tailwind CSS', category: 'Frontend', icon: 'Layout', order: 1 },
  { name: 'Node.js, Laravel, PHP, REST API', category: 'Backend', icon: 'Terminal', order: 2 },
  { name: 'MySQL, MongoDB, PostgreSQL', category: 'Database', icon: 'Database', order: 3 },
  { name: 'Git, GitHub, VS Code, Laragon', category: 'Tools', icon: 'Code2', order: 4 },
];

async function main() {
  console.log('Seeding skills...');
  
  // Clear existing skills to prevent duplicates (optional, but good for resetting)
  await prisma.skill.deleteMany();
  
  for (const skill of skills) {
    await prisma.skill.create({
      data: skill,
    });
  }
  
  console.log('Skills seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
