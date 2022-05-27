import { redirect } from '@remix-run/node';
import { ulid } from 'ulid';
import db from '../../../db/index.js';

export async function action({ request, params }) {
  const petId = params.petId;
  const formData = await request.formData();
  const owners = formData.getAll('owner').map((ownerId) => ({ id: ownerId }));
  const newOwnerName = formData.get('new-owner-name');

  const operations = [];

  if (newOwnerName) {
    const newPerson = { id: ulid(), name: newOwnerName };
    operations.push(
      db.person.create({
        data: newPerson,
      })
    );
    owners.push({ id: newPerson.id });
  }

  operations.push(
    db.pet.update({
      where: { id: petId },
      data: {
        owner: {
          connect: owners,
          // TODO: Test out
          // connectOrCreate
        },
      },
      include: {
        owner: true,
      },
    })
  );

  // newOwnerName;
  // Connect existing owners to pet
  await db.$transaction(operations);

  const accept = request.headers.get('accept');
  const secFetchMode = request.headers.get('sec-fetch-mode');
  const referer = request.headers.get('referer');

  if (accept.includes('application/json') || secFetchMode === 'cors') {
    // return json(results);
  }

  return redirect(referer, 303);
}
