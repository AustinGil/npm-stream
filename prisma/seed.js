const { ulid } = require('ulid');
const { faker } = require('@faker-js/faker');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const queries = Array.from({ length: 50 }).map(() => {
    return prisma.pet.create({
      data: {
        id: ulid(),
        name: faker.name.firstName(),
        type: 'dog',
        birthday: new Date(),
        owners: {
          create: [
            {
              id: ulid(),
              name: faker.name.firstName(),
            },
          ],
        },
        image: {
          create: {
            id: ulid(),
            name: faker.system.fileName(),
            size: 0,
            type: 'jpeg',
            url: 'https://placedog.net/640/480?random',
          },
        },
      },
    });
  });
  await Promise.all(queries);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
