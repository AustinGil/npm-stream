import { useLoaderData, Form, useSubmit } from '@remix-run/react';
import { searchParamsToQuery, debounce, getPetTypeSvgHref } from '../utils.js';
import { db } from '../services/index.js';
import LayoutDefault from '../layouts/Default.jsx';
import {
  Input,
  Btn,
  Grid,
  Card,
  Pagination,
  Svg,
} from '../components/index.js';

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
  const submit = useSubmit();
  const debouncedSubmit = debounce(submit, 300);
  const totalPages = Math.ceil(Number(data.count) / Number(query.perPage));

  return (
    <LayoutDefault title="Pets!">
      <Form
        onChange={(e) => debouncedSubmit(e.currentTarget)}
        className="grid sm:flex gap-4 flex-wrap items-end"
      >
        <Input
          id="search"
          label="Search"
          name="name[contains]"
          defaultValue={query.name?.contains ?? ''}
          className="flex-grow"
        />

        <div className="sm:order-1 flex items-center gap-4 flex-wrap w-full">
          <div className="flex items-center gap-1">
            <Input
              id="sort-by-name"
              label="Sort by name"
              name="sortBy[0]"
              type="checkbox"
              defaultValue="name"
              defaultChecked={query.sortBy[0] === 'name'}
            />
            <label htmlFor="sort-name-dir" className="sort-direction-toggle">
              <input
                id="sort-name-dir"
                type="checkbox"
                name="sortDir[0]"
                defaultValue="desc"
                defaultChecked={query.sortDir[0] === 'desc'}
                className="visually-hidden"
              />
              <Svg icon="chevron-down" />
              <Svg icon="chevron-up" />
              <span className="visually-hidden">Toggle sort direction</span>
            </label>
          </div>

          <div className="flex items-center gap-1">
            <Input
              id="sort-by-id"
              label="Sort by ID"
              name="sortBy[1]"
              type="checkbox"
              defaultValue="id"
              defaultChecked={query.sortBy[1] === 'id'}
            />
            <label htmlFor="sort-id-rid" className="sort-direction-toggle">
              <input
                id="sort-id-rid"
                type="checkbox"
                name="sortDir[1]"
                defaultValue="desc"
                defaultChecked={query.sortDir[1] === 'desc'}
                className="visually-hidden"
              />
              <Svg icon="chevron-down" />
              <Svg icon="chevron-up" />
              <span className="visually-hidden">Toggle sort direction</span>
            </label>
          </div>
        </div>

        <Btn type="submit">Search</Btn>
      </Form>

      <Grid
        items={doggos.map((doggo) => (
          <Card
            title={doggo.name}
            to={`/pet/${doggo.id}`}
            thumb={doggo.image?.url ?? ''}
            thumbAlt={doggo.name}
            placeholderSvg={getPetTypeSvgHref(doggo.type)}
            className="block-size-full"
          ></Card>
        ))}
      ></Grid>

      {totalPages > 1 && (
        <Pagination totalPages={totalPages} pageParam="page" className="mt-4" />
      )}
    </LayoutDefault>
  );
}
