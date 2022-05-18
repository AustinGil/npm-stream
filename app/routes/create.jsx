import { redirect } from '@remix-run/node';
import { useActionData, Link } from '@remix-run/react';
import { z } from 'zod';
import { ulid } from 'ulid';
import db from '../db/index.js';
import Input from '../components/Input.jsx';

export const petTypes = ['dog', 'cat', 'bird', 'reptile', 'fish', 'other'];

export const petSchema = z.object({
  name: z.string().min(1),
  type: z.enum(petTypes),
  birthday: z.date().optional(),
  // owner: TODO person ID
});

export async function action({ request }) {
  const formData = await request.formData();
  const body = Object.fromEntries(formData.entries());

  const { error, success, data } = petSchema.safeParse(body);

  if (!success) {
    return {
      errors: error.issues.map((issue) => issue.message),
    };
  }

  await db.pet.create({
    data: {
      id: ulid(),
      ...data,
    },
  });

  return redirect('/');
}

export default function Index() {
  const actionData = useActionData();
  const petOptions = petTypes.map((type) => ({
    label: type.charAt(0).toUpperCase() + type.slice(1),
    value: type,
  }));
  return (
    <div>
      <h1>Add A Pet</h1>

      {actionData?.errors?.length && (
        <ul>
          {actionData.errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}
      <form method="POST">
        <Input name="name" label="Name" id="name" required />
        <Input
          name="type"
          label="Type"
          id="type"
          type="select"
          options={['', ...petOptions]}
          required
        />

        <button type="submit">Add Doggo</button>
        <Link to="/">Cancel</Link>
      </form>
    </div>
  );
}
