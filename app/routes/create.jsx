import {
  unstable_parseMultipartFormData,
  json,
  redirect,
} from '@remix-run/node';
import { useActionData, Link, Form } from '@remix-run/react';
import { z } from 'zod';
import { ulid } from 'ulid';
import { db, uploadService } from '../services/index.js';
import LayoutDefault from '../layouts/Default.jsx';
import { Btn, Input } from '../components/index.js';

export const petTypes = [
  'dog',
  'cat',
  'bird',
  'reptile',
  'fish',
  'bunny',
  'other',
];

export const petSchema = z.object({
  name: z.string().min(1),
  type: z.enum(petTypes),
  birthday: z.preprocess(
    (v) => (v ? new Date(v) : undefined),
    z.date().optional()
  ),
  imageId: z.string().optional(),
  // owner: TODO person ID
});

/** @type {import('@remix-run/node').ActionFunction} */
export async function action({ request }) {
  const formData = await unstable_parseMultipartFormData(
    request,
    uploadService
  );
  const body = Object.fromEntries(formData.entries());

  const { error, success, data } = petSchema.safeParse(body);

  if (!success) {
    return {
      errors: error.issues.map((issue) => issue.message),
    };
  }

  data.id = ulid();

  if (body.file && body.file.name && body.file.size) {
    data.image = {
      create: {
        id: ulid(),
        size: body.image.size,
        url: `/uploads/${body.image.name}`,
        type: body.image.type,
        name: body.image.name,
      },
    };
  }

  await db.pet.create({
    data: data,
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
    <LayoutDefault title="Add A Pet">
      {actionData?.errors?.length && (
        <ul>
          {actionData.errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}
      <Form method="POST" encType="multipart/form-data" className="grid gap-4">
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

        <Input name="image" id="image" label="Photo" type="file" />

        <div className="flex items-center justify-between">
          <Btn type="submit">Add Pet</Btn>
          <Link to="/">Cancel</Link>
        </div>
      </Form>
    </LayoutDefault>
  );
}
