import { redirect } from '@remix-run/node';
import db from '../../../db/index.js';

export async function action({ params }) {
  const id = Number(params.petId);

  await db.user.delete({
    where: { id },
  });

  return redirect('/');
}
