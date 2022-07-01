import { redirect } from '@remix-run/node';
import { db } from '../../../services/index.js';
import { getSession, commitSession } from '../../../sessions.js';

export async function action({ request, params }) {
  const id = params.petId;
  try {
    await db.pet.delete({
      where: { id },
    });
    return redirect('/');
  } catch (error) {
    console.log(error);
    const session = await getSession(request.headers.get('Cookie'));
    session.flash('error', 'Invalid username/password');
    // TODO: Use referer when Remix issue is resolved
    // return redirect(request.headers.get('referer'), 303);
    return redirect(`/pet/${id}`, {
      status: 303,
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    });
  }
}
