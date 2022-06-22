import { redirect, json } from '@remix-run/node';
import { useLoaderData, useActionData, Form } from '@remix-run/react';
import { z } from 'zod';
import { ulid } from 'ulid';
import { searchParamsToQuery } from '../../utils.js';
import { db } from '../../services/index.js';
import { Btn, Input, Card, Pagination } from '../../components/index.js';

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const query = searchParamsToQuery(url.searchParams);

  /** @type {import('@prisma/client').Prisma.PersonFindManyArgs} */
  const params = {
    take: query.perPage,
    skip: (query.page - 1) * query.perPage,
    include: {
      image: true,
    },
    orderBy: [{ id: 'desc' }],
  };
  const countParams = {};

  if (query.name?.contains != null) {
    params.where = {
      name: query.name,
    };
    countParams.where = params.where;
  }
  if (query.sortBy?.length) {
    params.orderBy = [];
    for (let i = 0; i < query.sortBy.length; i++) {
      const sortBy = query.sortBy[i];
      const sortDir = query.sortDir[i] || 'asc';
      if (sortBy) {
        params.orderBy.push({ [sortBy]: sortDir });
      }
    }
  }

  const [items, count] = await Promise.all([
    db.person.findMany(params),
    db.person.count(countParams),
  ]);
  return {
    query: query,
    data: {
      items: items,
      count: count,
    },
  };
};

export const personSchema = z.object({
  name: z.string().min(1),
});

/** @type {import('@remix-run/node').ActionFunction} */
export async function action({ request }) {
  const formData = await request.formData();
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
  const { data, query } = useLoaderData();
  const peeps = data.items;
  // const actionData = useActionData();
  return (
    <div>
      <h1>Peeps!</h1>

      <Form>
        <div className="flex align-end gap-8">
          <Input
            id="search"
            label="Search"
            name="name[contains]"
            defaultValue={query.name?.contains ?? ''}
            className="flex-grow"
          />
          <Btn type="submit">Search</Btn>
        </div>

        <div className="flex align-center gap-16">
          <div className="flex align-center gap-8">
            <Input
              id="sort-by-name"
              label="Sort by name"
              name="sortBy[0]"
              type="checkbox"
              defaultValue="name"
              defaultChecked={query.sortBy[0] === 'name'}
            />
            <Input
              id="sort-dir-name"
              label="Sort direction"
              name="sortDir[0]"
              type="select"
              defaultValue={query.sortDir[0]}
              options={['asc', 'desc']}
              classes={{ label: 'visually-hidden' }}
            />
          </div>
          <div className="flex align-center gap-8">
            <Input
              id="sort-by-id"
              label="Sort by ID"
              name="sortBy[1]"
              type="checkbox"
              defaultValue="id"
              defaultChecked={query.sortBy[1] === 'id'}
            />
            <Input
              id="sort-dir-id"
              label="Sort direction"
              name="sortDir[1]"
              type="select"
              defaultValue={query.sortDir[1]}
              options={['asc', 'desc']}
              classes={{ label: 'visually-hidden' }}
            />
          </div>
        </div>
      </Form>

      {peeps.length > 0 && (
        <>
          <ul className="grid columns-3 gap-8 mbs-16">
            {peeps.map((person) => (
              <li key={person.id}>
                <Card
                  title={person.name}
                  to={`/person/${person.id}`}
                  thumb={person.image?.url ?? ''}
                  thumbAlt={person.name}
                  className="block-size-full"
                ></Card>
              </li>
            ))}
          </ul>

          <Pagination query={query} total={data.count} className="mbs-16" />
        </>
      )}

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
