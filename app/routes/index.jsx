import { useLoaderData, useActionData, Link } from '@remix-run/react';
import { z } from 'zod';
import db from '../db/index.js';

export const loader = async () => {
  return {
    data: await db.user.findMany(),
  };
};

export async function action({ request }) {
  const formData = await request.formData();
  const body = Object.fromEntries(formData.entries());

  const userSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
  });

  const { error, success, data } = userSchema.safeParse(body);

  if (!success) {
    return {
      errors: error.issues.map((issue) => issue.message),
    };
  }

  const user = await db.user.create({ data });

  return {
    data: user,
  };
}

export default function Index() {
  const { data: doggos } = useLoaderData();
  const actionData = useActionData();
  return (
    <div>
      <h1>Pets!</h1>

      {actionData?.errors?.length && (
        <ul>
          {actionData.errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}
      {doggos.length && (
        <ul>
          {doggos.map((doggo) => (
            <li key={doggo.id}>
              <Link to={`/pet/${doggo.id}`}>{doggo.name}</Link>
            </li>
          ))}
        </ul>
      )}
      <form method="POST">
        <div>
          <label htmlFor="name" required>
            Name
          </label>
          <input id="name" name="name" />
        </div>
        <div>
          <label htmlFor="email" required>
            Email
          </label>
          <input id="email" name="email" type="email" />
        </div>

        <button type="submit">Add Doggo</button>
      </form>
    </div>
  );
}
