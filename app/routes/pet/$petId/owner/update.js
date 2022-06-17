import { redirect, json } from '@remix-run/node';
import { db } from '../../../../services/index.js';

export async function action({ request, params }) {
  const petId = params.petId;
  const formData = await request.formData();
  const ownerIds = formData.getAll('owner');

  const results = await db.pet.update({
    where: { id: petId },
    data: {
      owners: {
        set: ownerIds.map((ownerId) => ({
          id: ownerId,
        })),
      },
    },
    include: {
      owners: true,
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
