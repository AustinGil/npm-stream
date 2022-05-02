// @ts-ignore
import prismapkg from '@prisma/client';
const { PrismaClient } = prismapkg;

/** @type {import('@prisma/client').PrismaClient} */
const prisma = new PrismaClient();

export default prisma;
