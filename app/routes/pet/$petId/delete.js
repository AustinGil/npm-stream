import { redirect } from '@remix-run/node';
import { db } from '../../../services/index.js';

export async function action({ params }) {
  const id = params.petId;

  await db.pet.delete({
    where: { id },
  });

  return redirect('/');
}
