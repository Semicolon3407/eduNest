import { User } from '../models/user.model';

export const seedSuperAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: 'SUPER_ADMIN' });

    if (!adminExists) {
      const superAdmin = await User.create({
        name: 'Product Owner',
        email: 'admin@edunest.com',
        password: 'adminpassword123', // User should change this
        role: 'SUPER_ADMIN',
      });
      console.log('Super Admin Seeded Successfully:', superAdmin.email);
    } else {
      console.log('Super Admin already exists.');
    }
  } catch (error) {
    console.error('Error seeding Super Admin:', error);
  }
};
