import 'dotenv/config';
import app from './app';
import connectDB from './config/db';
import { seedSuperAdmin } from './utils/seedAdmin';

const PORT = process.env.PORT ?? 5000;

const start = async () => {
  await connectDB();
  await seedSuperAdmin();

  app.listen(PORT, () => {
    const base = `http://localhost:${PORT}`;
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  🎓  EduNest Server');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`  Environment  : ${process.env.NODE_ENV}`);
    console.log(`  API Base     : ${base}/api`);
    console.log(`  Swagger Docs : ${base}/api/docs`);
    console.log('─────────────────────────────────────────────────');
    console.log('  Super Admin Credentials (change before deploy)');
    console.log(`  Email        : admin@edunest.com`);
    console.log(`  Password     : adminpassword123`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  });
};

start();
