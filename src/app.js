import Fastify from 'fastify';
import fastifyFormBody from '@fastify/formbody';
import db from './db.js';

const app = Fastify({
  // logger: true
});
app.register(fastifyFormBody);

app.get('/', async (request, reply) => {
  const allUsers = await db.user.findMany();
  return allUsers;
});
app.post('/', async (request, reply) => {
  const { email } = request.body;
  const newUser = await db.user.create({
    data: {
      email,
    },
  });
  return newUser;
});

export default app;
