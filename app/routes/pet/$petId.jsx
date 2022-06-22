import { unstable_parseMultipartFormData } from '@remix-run/node';
import {
  useLoaderData,
  useActionData,
  Form,
  useFetcher,
} from '@remix-run/react';
import { useState } from 'react';
import { ulid } from 'ulid';
import { db, uploadService } from '../../services/index.js';
import { petTypes, petSchema } from '../create.jsx';
import { Btn, Input, Svg } from '../../components/index.js';

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
      owners: true,
      image: true,
    },
  });
  if (!pet) {
    throw new Response('Not Found', {
      status: 404,
    });
  }

  let ownerSearch = searchParams.get('owner-search') ?? '';
  /** @type {import('@prisma/client').Prisma.PersonFindManyArgs} */
  let personSearchParams = {
    where: {
      id: {
        notIn: pet.owners.map((owner) => owner.id),
      },
    },
    take: 12,
  };
  if (ownerSearch) {
    personSearchParams.where.AND = {
      name: {
        contains: ownerSearch,
      },
    };
  }
  const personData = await db.person.findMany(personSearchParams);

  return {
    data: pet,
    ownerSearch,
    personData,
  };
};

export async function action({ params, request }) {
  const id = params.petId;
  const formData = await unstable_parseMultipartFormData(
    request,
    uploadService
  );
  const body = Object.fromEntries(formData.entries());

  const { error, success, data } = petSchema.safeParse(body);

  if (!success) {
    const errors = {};
    for (const issue of error.issues || []) {
      const key = issue.path[0];
      if (!errors[key]) {
        errors[key] = [];
      }
      errors[key].push(issue.message);
    }
    return {
      errors: errors,
    };
  }

  if (body.image) {
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
  const fetcher = useFetcher();

  function updateName(event) {
    setName(event.target.value);
  }
  const petOptions = petTypes.map((type) => ({
    label: type.charAt(0).toUpperCase() + type.slice(1),
    value: type,
  }));
  function resetForm(event) {
    // event.target.reset();
  }

  return (
    <>
      <h1>{name || pet.name}</h1>

      <div className="flex justify-center bs-256">
        {(pet.image && pet.image.url && (
          <img src={pet.image.url} alt={pet.name} className="is-256" />
        )) || <Svg label="Avatar" icon="paw-print" className="size-256" />}
      </div>

      <h2 className="size-24">Details:</h2>
      <Form
        method="POST"
        encType="multipart/form-data"
        className="grid gap-8 mbe-16"
      >
        <Input
          id="name"
          name="name"
          label="Name"
          value={name}
          onChange={updateName}
          errors={actionData?.errors?.name}
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
        <Input id="image" name="image" label="Photo" type="file" />

        <div>
          <Btn type="submit">Edit Pet</Btn>
        </div>
      </Form>

      {pet.owners?.length > 0 && (
        <>
          <h2 className="size-24">Owners</h2>
          <fetcher.Form
            id="owner-list"
            action={`/pet/${pet.id}/owner/update`}
            method="POST"
            className="mbe-8"
          >
            <fieldset>
              {/* <legend>Owners</legend> */}
              {pet.owners.map((owner) => (
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
          </fetcher.Form>

          <Btn form="owner-list" type="submit" className="mbe-16">
            Save Owners
          </Btn>
        </>
      )}

      <h2 className="size-24">Add Owners</h2>
      <Form className="relative flex align-end mbe-8">
        <Input
          id="search"
          label="Search"
          name="owner-search"
          defaultValue={ownerSearch}
          className="flex-grow"
          classes={{ input: 'pie-16' }}
        />
        <Btn
          type="submit"
          isPlain
          className="absolute r-0 b-0 border-transparent bg-transparent color-inherit"
        >
          <Svg label="Search Owners" icon="magnifying-glass" />
        </Btn>
      </Form>

      <fetcher.Form
        action={`/pet/${pet.id}/owner`}
        method="POST"
        onSubmit={resetForm}
        className="mbe-16"
      >
        {personData?.length > 0 && (
          <fieldset className="mbe-8">
            <legend>Existing Owners</legend>
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
        )}
        <Input
          id="new-owner-name"
          label="New Owner Name"
          name="new-owner-name"
          className="mbe-8"
        />
        <Btn type="submit">Add Owner</Btn>
      </fetcher.Form>

      <Form action={`/pet/${pet.id}/delete`} method="POST">
        <Btn type="submit">Delete Pet</Btn>
      </Form>
    </>
  );
}
