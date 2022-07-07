import { unstable_parseMultipartFormData } from '@remix-run/node';
import {
  useLoaderData,
  useActionData,
  useTransition,
  Form,
  useFetcher,
} from '@remix-run/react';
import { useState, useEffect, useRef } from 'react';
import { ulid } from 'ulid';
import { db, uploadService } from '../../../services/index.js';
import { petTypes, petSchema } from '../../create.jsx';
import LayoutDefault from '../../../layouts/Default.jsx';
import { Btn, Input, Svg } from '../../../components/index.js';

// /** @type {import('@remix-run/node').LoaderFunction<string>} */
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

  const { error, success, data } = petSchema.partial().safeParse(body);

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

  if (body.file && body.file.name && body.file.size) {
    delete data.imageId;
    data.image = {
      create: {
        id: ulid(),
        size: body.file.size,
        url: `/uploads/${body.file.name}`,
        type: body.file.type,
        name: body.file.name,
      },
    };
  } else {
    data.imageId = data.imageId || null;
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
  const transition = useTransition();
  const newOwnerFetcher = useFetcher();
  const newOwnerRef = useRef();
  const actionData = useActionData();

  const petOptions = petTypes.map((type) => ({
    label: type.charAt(0).toUpperCase() + type.slice(1),
    value: type,
  }));

  const [imgId, setImgId] = useState(pet.imageId ?? '');
  useEffect(() => {
    setImgId(pet.imageId);
  }, [pet]);

  useEffect(() => {
    if (newOwnerFetcher.type === 'done' && newOwnerFetcher.data.id) {
      newOwnerRef.current.reset();
    }
  }, [newOwnerFetcher]);

  return (
    <LayoutDefault
      title={
        transition.submission
          ? transition.submission?.formData.get('name')
          : pet.name
      }
    >
      <div className="w-64 m-auto mb-8 aspect-square">
        {pet.image && (
          <div className="relative aspect-square">
            <img src={pet.image.url} alt={pet.name} />

            <Form
              method="POST"
              encType="multipart/form-data"
              className="absolute bottom-0 right-0"
            >
              <input type="hidden" name="imageId" defaultValue="" />
              <Btn type="submit" className="rounded-full bg-black-700">
                <span aria-hidden="true">&times;</span>
                <span className="visually-hidden">Remove photo</span>
              </Btn>
            </Form>
          </div>
        )}
        {!pet.image && (
          <Svg label="Avatar" icon="paw-print" className="text-[16rem]" />
        )}
      </div>

      <h2>Details:</h2>
      <Form
        method="POST"
        encType="multipart/form-data"
        className="grid gap-2 mb-8"
      >
        <Input
          id="name"
          name="name"
          label="Name"
          defaultValue={pet.name}
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
        {/* TODO: Image URL and upload should be separate fields and support JS/no-JS 
        <Input
          id="image-url"
          name="image-url"
          label="Image URL"
          defaultValue={pet.image.url}
        /> */}
        {/* TODO: Pull file uploads into dedicated route */}

        <input name="imageId" type="hidden" defaultValue={imgId} />

        <Input id="file" name="file" label="Photo" type="file" />

        <div>
          <Btn type="submit">Edit Pet</Btn>
        </div>
      </Form>

      {pet.owners?.length > 0 && (
        <>
          <h2>Owners</h2>
          <Form
            action={`/pet/${pet.id}/owner/update`}
            method="POST"
            className="grid gap-2 mb-8"
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

            <div>
              <Btn type="submit">Save Owners</Btn>
            </div>
          </Form>
        </>
      )}

      <h2>Add Owners</h2>
      <Form className="relative flex items-end mb-2">
        <Input
          id="search"
          label="Search"
          name="owner-search"
          defaultValue={ownerSearch}
          className="flex-grow"
          classes={{ input: 'pr-8' }}
        />
        <Btn
          type="submit"
          isPlain
          className="absolute right-0 bottom-0 border-transparent bg-transparent text-inherit"
        >
          <Svg label="Search Owners" icon="magnifying-glass" />
        </Btn>
      </Form>

      <newOwnerFetcher.Form
        ref={newOwnerRef}
        action={`/pet/${pet.id}/owner`}
        method="POST"
        className="mb-8"
      >
        {personData?.length > 0 && (
          <fieldset className="mb-2">
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
          className="mb-2"
        />
        <Btn type="submit">Add Owner</Btn>
      </newOwnerFetcher.Form>

      <Form action={`/pet/${pet.id}/delete`} method="POST">
        <Btn type="submit">Delete Pet</Btn>
      </Form>
    </LayoutDefault>
  );
}
