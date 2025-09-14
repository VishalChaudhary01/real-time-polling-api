import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export async function connectDatabase() {
  try {
    await prisma.$connect();
    console.log('Postgres Database Connected!');
  } catch (error) {
    console.error('Failed to connect to Postgres Databasee');
    process.exit(1);
  }
}
