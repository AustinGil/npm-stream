import { PrismaClient } from '@prisma/client';
/** @type {import('@prisma/client').PrismaClient} */
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: ['query'],
});

export default prisma;
