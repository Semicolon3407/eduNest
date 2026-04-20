import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User';
import connectDB from './config/db';

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const adminEmail = 'admin@edunest.com';
    const adminExists = await User.findOne({ email: adminEmail });

    if (adminExists) {
      console.log('Admin already exists');
      process.exit(0);
    }

    await User.create({
      name: 'Super Admin',
      email: adminEmail,
      password: 'adminpassword123',
      role: 'SUPER_ADMIN',
    });

    console.log('Super Admin created successfully');
    console.log('Email: admin@edunest.com');
    console.log('Password: adminpassword123');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
