import { useLoaderData, useActionData } from '@remix-run/react';
import { useState } from 'react';
import { z } from 'zod';
import db from '../../db/index.js';

export const loader = async ({ params }) => {
  const id = Number(params.petId);
  return {
    data: await db.user.findFirst({
      where: {
        id: id,
      },
    }),
  };
};

export async function action({ params, request }) {
  const id = Number(params.petId);
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

  const user = await db.user.update({
    where: {
      id: id,
    },
    data: data,
  });

  return {
    data: user,
  };
}

export default function Index() {
  const { data: doggo } = useLoaderData();
  const actionData = useActionData();
  const [name, setName] = useState(doggo.name);

  function updateName(event) {
    setName(event.target.value);
  }

  return (
    <div>
      <h1>{name || doggo.name}</h1>

      {actionData?.errors?.length && (
        <ul>
          {actionData.errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}
      <form method="POST">
        <div>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            required
            value={name}
            onChange={updateName}
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            defaultValue={doggo.email}
          />
        </div>

        <button type="submit">Edit Doggo</button>
      </form>

      <form action={`/pet/${doggo.id}/delete`} method="POST">
        <button>Delete Doggo</button>
      </form>
    </div>
  );
}
