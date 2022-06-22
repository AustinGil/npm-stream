import { redirect } from '@remix-run/node';
import { db } from '../../services/index.js';

export async function action({ params }) {
  const id = params.personId;

  await db.person.delete({
    where: { id },
  });

  return redirect('/person');
}
