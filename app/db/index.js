import { PrismaClient } from '@prisma/client';
/** @type {import('@prisma/client').PrismaClient} */
const prisma = new PrismaClient({ log: ['query'] });

export default prisma;
