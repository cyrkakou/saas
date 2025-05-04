import { initializeDatabase } from '@/infrastructure/database';
import { getUserRepository } from '@/infrastructure/database';
import { createId } from '@paralleldrive/cuid2';
import * as crypto from 'crypto';

async function setupAdmin() {
  try {
    // Initialize the database
    await initializeDatabase();

    // Get the user repository
    const userRepository = await getUserRepository();

    // Check if admin user already exists
    const existingAdmin = await userRepository.findByEmail('admin@example.com');

    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user
    const password = 'admin123'; // Default password
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto
      .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
      .toString('hex');

    await userRepository.create({
      email: 'admin@example.com',
      name: 'Admin User',
      password: `${salt}:${hash}`,
      roleId: '2', // Assuming '2' is the ID for the 'admin' role
      isActive: true
    });

    console.log('Admin user created successfully');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');
  } catch (error) {
    console.error('Error setting up admin user:', error);
  }
}

// Run the setup
setupAdmin()
  .then(() => {
    console.log('Admin setup completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Admin setup failed:', error);
    process.exit(1);
  });
