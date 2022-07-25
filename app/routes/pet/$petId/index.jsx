import { unstable_parseMultipartFormData } from '@remix-run/node';
import {
  useLoaderData,
  useActionData,
  useTransition,
  Form,
} from '@remix-run/react';
import { useState, useEffect } from 'react';
import { db, uploadService } from '../../../services/index.js';
import { getPetTypeSvgHref } from '../../../utils.js';
import { petTypes, petSchema } from '../../create.jsx';
import LayoutDefault from '../../../layouts/Default.jsx';
import { Btn, Input, Svg, Dialog } from '../../../components/index.js';

// /** @type {import('@remix-run/node').LoaderFunction<string>} */
export const loader = async ({ params, request }) => {
  const id = params.petId;

  const pet = await db.pet.findFirst({
    where: {
      id: id,
    },
    include: {
      image: true,
    },
  });
  if (!pet) {
    throw new Response('Not Found', {
      status: 404,
    });
  }

  return {
    data: pet,
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
  const { data: pet } = useLoaderData();
  const transition = useTransition();
  const actionData = useActionData();

  const petOptions = petTypes.map((type) => ({
    label: type.charAt(0).toUpperCase() + type.slice(1),
    value: type,
  }));

  const [imgId, setImgId] = useState(pet.imageId ?? '');
  useEffect(() => {
    setImgId(pet.imageId);
  }, [pet]);

  function promptDelete(event) {
    if (
      confirm(
        `Are you sure you want to delete this entry? This cannot be undone.`
      )
    ) {
      return;
    }

    event.preventDefault();
  }

  return (
    <LayoutDefault
      title={
        transition.submission
          ? transition.submission?.formData.get('name')
          : pet.name
      }
    >
      <div className="border-2 rounded p-4 bg-white">
        <div className="w-64 m-auto mb-8 aspect-square">
          {pet.image && (
            <div className="group relative aspect-square">
              <img
                src={pet.image.url}
                alt={pet.name}
                className="w-full h-full object-cover"
              />

              <Form
                method="POST"
                encType="multipart/form-data"
                className="absolute bottom-1 right-1"
              >
                <input type="hidden" name="imageId" defaultValue="" />
                <Btn
                  type="submit"
                  className="rounded-full p-1 text-2xl leading-0 bg-gray-700 opacity-50 group-hover:opacity-100"
                >
                  <Svg label="Remove photo" icon="cancel" />
                </Btn>
              </Form>
            </div>
          )}
          {!pet.image && (
            <Svg label="Avatar" href={getPetTypeSvgHref(pet.type)} />
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

          <input name="imageId" type="hidden" defaultValue={imgId} />

          <Input id="file" name="file" label="Photo" type="file" />

          <div>
            <Btn type="submit">Edit Pet</Btn>
          </div>
        </Form>

        <Dialog id="delete-modal" toggle="Delete">
          <p>Are you sure you want to delete this entry?</p>
          <Form
            action={`/pet/${pet.id}/delete`}
            method="POST"
            onSubmit={promptDelete}
          >
            <Btn type="submit">Delete Pet</Btn>
          </Form>
        </Dialog>
      </div>
    </LayoutDefault>
  );
}
