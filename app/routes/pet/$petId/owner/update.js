import { redirect, json } from '@remix-run/node';
import { db } from '../../../../services/index.js';
import { isFetchRequest } from '../../../../utils.js';

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

  if (isFetchRequest(request)) {
    return json(results);
  }

  return redirect(request.headers.get('referer'), 303);
}
