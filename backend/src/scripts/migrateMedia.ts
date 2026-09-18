import { migrateDiskUploadsToDb } from '../services/mediaService';

async function main() {
  console.log('🔄 Starting migration of disk uploads to database...');
  try {
    const count = await migrateDiskUploadsToDb();
    console.log(`✅ Migration completed! ${count} new files imported into database.`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }
}

main();
