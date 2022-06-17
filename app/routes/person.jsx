import { redirect, json } from '@remix-run/node';
import { useLoaderData, useActionData, Link } from '@remix-run/react';
import { z } from 'zod';
import { ulid } from 'ulid';
import { db } from '../services/index.js';
import { Btn, Input } from '../components/index.js';

export const loader = async () => {
  const data = await db.person.findMany();
  return {
    data: data,
  };
};

export const personSchema = z.object({
  name: z.string().min(1),
});

/** @type {import('@remix-run/node').ActionFunction} */
export async function action({ request }) {
  // TODO: Look into  Error: Invalid MIME type
  const formData = await request.formData().catch(console.log);
  if (!formData) return redirect('/');

  const body = Object.fromEntries(formData.entries());

  const { error, success, data } = personSchema.safeParse(body);

  if (!success) {
    return {
      errors: error.issues.map((issue) => issue.message),
    };
  }

  const results = await db.person.create({
    data: {
      id: ulid(),
      ...data,
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

export default function Index() {
  /** @type {Awaited<ReturnType<typeof loader>>} */
  const { data } = useLoaderData();
  // const actionData = useActionData();
  return (
    <div>
      <h1>Add A Person</h1>

      <pre>{JSON.stringify(data, null, 2)}</pre>

      {/* {actionData?.errors?.length && (
        <ul>
          {actionData.errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )} */}
      {/* <form method="POST">
        <Input name="name" label="Name" id="name" required />
        <Input
          name="type"
          label="Type"
          id="type"
          type="select"
          options={['', ...petOptions]}
          required
        />

        <Btn type="submit">Add Doggo</Btn>
        <Link to="/">Cancel</Link>
      </form> */}
    </div>
  );
}
