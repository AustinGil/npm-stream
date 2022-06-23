import { useLoaderData, useActionData, Form } from '@remix-run/react';
import { useState } from 'react';
import { db } from '../../services/index.js';
import { petTypes, petSchema } from '../create.jsx';
import { Btn, Input, Dialog } from '../../components/index.js';

export const loader = async ({ params }) => {
  const id = params.personId;
  return {
    data: await db.person.findFirst({
      where: {
        id: id,
      },
    }),
  };
};

export async function action({ params, request }) {
  const id = params.personId;
  const formData = await request.formData();
  const body = Object.fromEntries(formData.entries());

  const { error, success, data } = petSchema.safeParse(body);

  if (!success) {
    return {
      errors: error.issues.map((issue) => issue.message),
    };
  }

  const pet = await db.pet.update({
    where: {
      id: id,
    },
    data: data,
  });

  return {
    data: pet,
  };
}

export default function Index() {
  /** @type {Awaited<ReturnType<typeof loader>>} */
  const { data: person } = useLoaderData();
  // const actionData = useActionData();
  const [name, setName] = useState(person.name);

  function updateName(event) {
    setName(event.target.value);
  }

  return (
    <div>
      <h1>{name || person.name}</h1>
      <Form method="POST" className="grid gap-2 mb-16">
        <Input
          id="name"
          name="name"
          label="Name"
          value={name}
          onChange={updateName}
        />

        <div>
          <Btn type="submit">Edit</Btn>
        </div>
      </Form>

      <Dialog
        toggle={
          <>
            <span className="inline-block radius-4 pi-12 pb-4 text-white bg-primary">
              Delete
            </span>
          </>
        }
      >
        Dialog content plz
      </Dialog>

      <Form action={`/person/${person.id}/delete`} method="POST">
        <Btn type="submit">Delete</Btn>
      </Form>
    </div>
  );
}
