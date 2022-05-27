import { redirect, json } from '@remix-run/node';
import db from '../../../../db/index.js';

export async function action({ request, params }) {
  const petId = params.petId;
  const formData = await request.formData();
  const owners = formData.getAll('owner').map((ownerId) => ({ id: ownerId }));

  // Connect existing owners to pet
  const results = await db.pet.update({
    where: { id: petId },
    data: {
      owner: {
        set: owners,
      },
    },
    include: {
      owner: true,
    },
  });

  const accept = request.headers.get('accept');
  const secFetchMode = request.headers.get('sec-fetch-mode');
  const referer = request.headers.get('referer');

  if (accept.includes('application/json') || secFetchMode === 'cors') {
    return json(results);
  }

  return redirect(referer, 303);
}
