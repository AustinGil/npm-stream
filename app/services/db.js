import { PrismaClient } from '@prisma/client';
/** @type {import('@prisma/client').PrismaClient} */
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: process.env.NODE_ENV === 'development' ? ['query'] : [],
});

export default prisma;
