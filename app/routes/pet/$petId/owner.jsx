import { redirect, json } from '@remix-run/node';
import { ulid } from 'ulid';
import db from '../../../db/index.js';

export async function action({ request, params }) {
  const petId = params.petId;
  const formData = await request.formData();
  const ownerIds = formData.getAll('owner');
  const newOwnerName = formData.get('new-owner-name');

  const operations = [];

  if (newOwnerName) {
    const newPerson = { id: ulid(), name: newOwnerName };
    operations.push(
      db.person.create({
        data: newPerson,
      })
    );
  }

  operations.push(
    db.pet.update({
      where: { id: petId },
      data: {
        owners: {
          connect: ownerIds.map((ownerId) => ({
            id: ownerId,
          })),
        },
      },
      include: {
        owners: true,
      },
    })
  );

  // Grab second index of operations results
  const results = await db.$transaction(operations);
  const data = results[1] || results[0];

  const accept = request.headers.get('accept');
  const secFetchMode = request.headers.get('sec-fetch-mode');
  const referer = request.headers.get('referer');

  if (accept.includes('application/json') || secFetchMode === 'cors') {
    return json(data);
  }

  return redirect(referer, 303);
}
