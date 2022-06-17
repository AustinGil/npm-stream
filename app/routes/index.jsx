import { useLoaderData, Link, Form } from '@remix-run/react';
import { searchParamsToQuery } from '../utils.js';
import { db } from '../services/index.js';
import { Btn, Card, Input, Pagination } from '../components/index.js';

/** @type {import('@remix-run/node').LoaderFunction} */
export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const query = searchParamsToQuery(url.searchParams);

  /** @type {import('@prisma/client').Prisma.PetFindManyArgs} */
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
    db.pet.findMany(params),
    db.pet.count(countParams),
  ]);
  return {
    query: query,
    data: {
      items: items,
      count: count,
    },
  };
};

export default function Index() {
  /** @type {Awaited<ReturnType<typeof loader>>} */
  const { data, query } = useLoaderData();
  const doggos = data.items;

  return (
    <div>
      <h1>Pets!</h1>
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

      {doggos.length > 0 && (
        <>
          <ul className="grid columns-3 gap-8 mbs-16">
            {doggos.map((doggo) => (
              <li key={doggo.id}>
                <Card
                  title={doggo.name}
                  to={`/pet/${doggo.id}`}
                  thumb={doggo.image?.url ?? ''}
                  thumbAlt={doggo.name}
                  className="block-size-full"
                ></Card>
              </li>
            ))}
          </ul>

          <Pagination query={query} total={data.count} />
        </>
      )}
      {JSON.stringify(query, null, 2)}
    </div>
  );
}
