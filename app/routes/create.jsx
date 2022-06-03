import {
  redirect,
  unstable_parseMultipartFormData,
  unstable_createFileUploadHandler,
} from '@remix-run/node';
import { useActionData, Link, Form } from '@remix-run/react';
import { z } from 'zod';
import { ulid } from 'ulid';
import db from '../db/index.js';
import { Btn, Input } from '../components/index.js';

export const petTypes = ['dog', 'cat', 'bird', 'reptile', 'fish', 'other'];

export const petSchema = z.object({
  name: z.string().min(1),
  type: z.enum(petTypes),
  birthday: z.preprocess((v) => new Date(v || Date.now()), z.date().optional()),
  // owner: TODO person ID
});

export async function action({ request }) {
  const standardFileUploadHandler = unstable_createFileUploadHandler({
    directory: 'public/uploads',
  });

  const formData = await unstable_parseMultipartFormData(
    request,
    standardFileUploadHandler
  );
  const body = Object.fromEntries(formData.entries());

  const { error, success, data } = petSchema.safeParse(body);

  console.log(data);

  if (!success) {
    return {
      errors: error.issues.map((issue) => issue.message),
    };
  }

  await db.pet.create({
    data: {
      id: ulid(),
      ...data,
      image: {
        create: {
          id: ulid(),
          size: body.photo.size,
          url: `/uploads/${body.photo.name}`,
          type: body.photo.type,
          name: body.photo.name,
        },
      },
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
      <Form method="POST" encType="multipart/form-data">
        <Input name="name" label="Name" id="name" required />
        <Input
          name="type"
          label="Type"
          id="type"
          type="select"
          options={['', ...petOptions]}
          required
        />
        <Input name="birthday" label="Birthday" id="birthday" type="date" />

        <Input name="photo" id="photo" label="Photo" type="file" />

        <Btn type="submit">Add Doggo</Btn>
        <Link to="/">Cancel</Link>
      </Form>
    </div>
  );
}
