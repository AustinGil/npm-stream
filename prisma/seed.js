// import { ulid } from 'ulid';
// import { faker } from '@faker-js/faker';
// import { PrismaClient } from '@prisma/client';
const { ulid } = require('ulid');
const { faker } = require('@faker-js/faker');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// model Upload {
//   id     String @id
//   name   String
//   url    String
//   size   Int
//   type String
//   person Person ?
//     pet    Pet ?
// }

// model Person {
//   id      String @id
//   name    String
//   pet     PersonOnPet[]
//   imageId String ?
//     image   Upload ?     @relation(fields: [imageId], references: [id])
// }

// model Pet {
//   id      String @id
//   name    String
//   type String
//   birthday DateTime @default (now())
//   owner   PersonOnPet[]
//   imageId String ?
//     image   Upload ?     @relation(fields: [imageId], references: [id])
// }

// model PersonOnPet {
//   owner       Person @relation(fields: [personId], references: [id])
//   personId    String // relation scalar field (used in the `@relation` attribute above)
//   pet         Pet @relation(fields: [petId], references: [id])
//   petId       String // relation scalar field (used in the `@relation` attribute above)

//   @@id([personId, petId])
// }

async function main() {
  // await prisma.person.create({
  //   data: {
  //     id: ulid(),
  //     name: faker.name.firstName(),
  //   },
  // });

  const image = faker.image.animals();
  const imageId = ulid();

  await prisma.pet.create({
    data: {
      id: ulid(),
      name: faker.name.firstName(),
      type: 'dog',
      birthday: new Date(),
      owner: {
        create: [
          {
            owner: {
              create: {
                id: ulid(),
                name: faker.name.firstName(),
              },
            },
          },
        ],
      },
      // imageId: imageId,
      // image: [
      //   {
      //     create: {
      //       id: imageId,
      //       name: faker.system.fileName(),
      //       size: image.width * image.height,
      //       type: faker.system.commonFileExt(),
      //       url: 'https://placedog.net/640/480?random',
      //     },
      //   },
      // ],
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
