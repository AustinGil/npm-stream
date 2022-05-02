import app from './app.js';

const start = async () => {
  try {
    await app.listen(3000);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
start().then(() => {
  console.log('server running at http://localhost:3000');
});

// main()
//   .catch((e) => {
//     // TODO: Don't do this
//     throw e;
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
