import { useLoaderData, useActionData, Outlet } from '@remix-run/react';
import { useState } from 'react';
import db from '../../db/index.js';
import { petTypes, petSchema } from '../create.jsx';
import { Btn, Input } from '../../components/index.js';

/** @type {import('@remix-run/node').LoaderFunction} */
export const loader = async ({ params, request }) => {
  const id = params.petId;
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const pet = await db.pet.findFirst({
    where: {
      id: id,
    },
    include: {
      owner: true,
    },
  });
  if (!pet) {
    throw new Response('Not Found', {
      status: 404,
    });
  }

  let ownerSearch = searchParams.get('owner-search') ?? '';
  let personData = [];
  if (ownerSearch) {
    personData = await db.person.findMany({
      where: {
        name: {
          contains: ownerSearch,
        },
      },
    });
  }

  return {
    data: pet,
    ownerSearch,
    personData,
  };
};

export async function action({ params, request }) {
  const id = params.petId;
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
  const { data: pet, ownerSearch, personData } = useLoaderData();
  const actionData = useActionData();
  const [name, setName] = useState(pet.name);

  function updateName(event) {
    setName(event.target.value);
  }
  const petOptions = petTypes.map((type) => ({
    label: type.charAt(0).toUpperCase() + type.slice(1),
    value: type,
  }));

  return (
    <>
      <h1>{name || pet.name}</h1>

      {actionData?.errors?.length && (
        <ul>
          {actionData.errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}

      <h2 className="size-24">Details:</h2>
      <form method="POST" className="mbe-16">
        <Input
          id="name"
          name="name"
          label="Name"
          value={name}
          onChange={updateName}
        />
        <Input
          id="type"
          name="type"
          label="Type"
          type="select"
          options={['', ...petOptions]}
          defaultValue={pet.type}
          required
        />
        <Input
          id="birthday"
          name="birthday"
          label="Birthday"
          type="date"
          defaultValue={new Date(pet.birthday).toISOString().split('T')[0]}
          required
        />

        <Btn type="submit">Edit Pet</Btn>
      </form>

      {pet.owner?.length > 0 && (
        <>
          <h2 className="size-24">Owners</h2>
          <form
            id="owner-list"
            action={`/pet/${pet.id}/owner/update`}
            method="POST"
          >
            <fieldset>
              {/* <legend>Owners</legend> */}
              {pet.owner.map((owner) => (
                <Input
                  key={owner.id}
                  id={owner.id}
                  defaultValue={owner.id}
                  defaultChecked={true}
                  label={owner.name}
                  name="owner"
                  type="checkbox"
                />
              ))}
            </fieldset>
          </form>

          <Btn form="owner-list" type="submit" className="mbe-16">
            Save Owners
          </Btn>
        </>
      )}

      {/* <Outlet context={{ data: pet, personData }} /> */}
      <form className="flex gap-8 align-end">
        <Input
          id="search"
          label="Search"
          name="owner-search"
          defaultValue={ownerSearch}
          className="flex-grow"
        />
        <Btn type="submit">Search Owners</Btn>
      </form>

      <form action={`/pet/${pet.id}/owner`} method="POST">
        <fieldset>
          <legend>Owners</legend>
          {personData.map((person) => (
            <Input
              key={person.id}
              id={person.id}
              defaultValue={person.id}
              label={person.name}
              name="owner"
              type="checkbox"
            />
          ))}
        </fieldset>
        <Btn type="submit">Add Existing Owner</Btn>
      </form>

      <form
        action={`/pet/${pet.id}/owner`}
        method="POST"
        className="flex gap-8 align-end"
      >
        <Input
          id="new-owner-name"
          label="Name"
          name="new-owner-name"
          className="flex-grow"
        />
        <Btn type="submit">Add New Owner</Btn>
      </form>

      <form action={`/pet/${pet.id}/delete`} method="POST">
        <Btn type="submit">Delete Pet</Btn>
      </form>
    </>
  );
}
