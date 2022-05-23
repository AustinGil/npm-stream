import { useLoaderData, Link } from '@remix-run/react';
import db from '../db/index.js';
import { Btn, Card, Input } from '../components/index.js';

const DEFAULT_PER_PAGE = 10;

/**
 * @param {URLSearchParams} searchParams
 * @param {{
 * allowedColumns: string[]
 * }} [options={}]
 * @return {Record<string, any> & {
 * page: number,
 * perPage: number
 * }}
 */
function searchParamsToQuery(searchParams, options = {}) {
  const query = {};
  /**
   * Grabs the different parts from sort query params `sortBy[0]col` & `sortBy[0]dir`
   * @see https://regex101.com/r/Aqvy8J/1
   */
  const sortKeyRegex = /(?<param>\w+)\[(?<index>\d+)\](?<sortKey>\w+)/;
  for (let [key, value] of searchParams) {
    let index;
    if (sortKeyRegex.test(key)) {
      const groups = sortKeyRegex.exec(key)?.groups;
      const allowedColumns = options.allowedColumns || [];

      if (
        !allowedColumns.length ||
        (groups.sortKey === 'col' && !allowedColumns.includes(value))
      ) {
        continue;
      }
      key = groups.param;

      if (!Array.isArray(query[key])) {
        query[key] = [];
      }

      index = Number(groups.index);
      const item = query[key][index] || {};

      item[groups.sortKey] = value;
      query[key][index] = item;
      continue;
    }

    if (query[key] === undefined) {
      query[key] = value;
      continue;
    }
    if (Array.isArray(query[key])) {
      query[key].push(value);
      continue;
    }
    query[key] = [query[key], value];
  }
  query.perPage = query.perPage ? parseInt(query.perPage) : DEFAULT_PER_PAGE;
  query.perPage = Math.max(query.perPage, 1);
  query.page = query.page ? parseInt(query.page) - 1 : 0;
  query.page = Math.max(query.page, 0);
  return query;
}

/** @type {import('@remix-run/node').LoaderFunction} */
export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const query = searchParamsToQuery(searchParams, {
    allowedColumns: ['id', 'name'],
  });

  /** @type {import('@prisma/client').Prisma.PetFindManyArgs} */
  const params = {
    take: query.perPage,
    skip: query.page * query.perPage,
  };
  const countParams = {};

  if (searchParams.has('search')) {
    params.where = {
      name: {
        contains: searchParams.get('search').trim(),
      },
    };
    countParams.where = params.where;
  }
  if (query.sortBy?.length) {
    params.orderBy = [];
    for (const item of query.sortBy) {
      const sortBy = item.col?.trim();
      const direction = item.dir?.trim() || 'asc';
      if (sortBy) {
        params.orderBy.push({ [sortBy]: direction });
      }
    }
  }

  const [items, count] = await Promise.all([
    db.pet.findMany(params),
    db.pet.count(countParams),
  ]);
  return {
    query: params,
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
  // const searchParams = new URLSearchParams(query)
  const currentPage = query.page + 1;
  const perPage = query.perPage;
  const previousParams = new URLSearchParams({
    ...query,
    page: currentPage - 1,
  });
  const nextParams = new URLSearchParams({
    ...query,
    page: currentPage + 1,
  });
  const lastPage = Math.ceil(data.count / perPage);

  return (
    <div>
      <h1>Pets!</h1>
      <form>
        <div className="flex align-end gap-8">
          <Input
            id="search"
            label="Search"
            name="search"
            defaultValue={query.where?.name?.contains ?? ''}
            className="flex-grow"
          />
          <Btn type="submit">Search</Btn>
        </div>

        <div className="flex align-center gap-16">
          <div className="flex align-center gap-8">
            <Input
              id="sort-by-name"
              label="Sort by name"
              name="sortBy[0]col"
              type="checkbox"
              defaultValue="name"
              defaultChecked={query.orderBy?.find((item) =>
                Object.prototype.hasOwnProperty.call(item, 'name')
              )}
            />
            <Input
              id="sort-dir-name"
              label="Sort direction"
              name="sortBy[0]dir"
              type="select"
              defaultValue={query.orderBy?.reduce((dir, item, index, arr) => {
                if (dir) return dir;
                if (Object.prototype.hasOwnProperty.call(item, 'name')) {
                  return (item && item.name) || 'asc';
                }
                return index === arr.length - 1 ? 'asc' : dir;
              }, '')}
              options={['asc', 'desc']}
              classes={{ label: 'visually-hidden' }}
            />
          </div>
          <div className="flex align-center gap-8">
            <Input
              id="sort-by-id"
              label="Sort by ID"
              name="sortBy[1]col"
              type="checkbox"
              defaultValue="id"
              defaultChecked={query.orderBy?.find((item) =>
                Object.prototype.hasOwnProperty.call(item, 'id')
              )}
            />
            <Input
              id="sort-dir-id"
              label="Sort direction"
              name="sortBy[1]dir"
              type="select"
              defaultValue={query.orderBy?.reduce((dir, item, index, arr) => {
                if (dir) return dir;
                if (Object.prototype.hasOwnProperty.call(item, 'id')) {
                  return (item && item.id) || 'asc';
                }
                return index === arr.length - 1 ? 'asc' : dir;
              }, '')}
              options={['asc', 'desc']}
              classes={{ label: 'visually-hidden' }}
            />
          </div>
        </div>
      </form>

      {doggos.length && (
        <>
          <ul className="grid columns-3 gap-8">
            {doggos.map((doggo) => (
              <li key={doggo.id}>
                <Card
                  title={doggo.name}
                  to={`/pet/${doggo.id}`}
                  thumb="https://placedog.net/500"
                  thumbAlt={doggo.name}
                >
                  <p>Text</p>
                  <a href="#">text</a>
                </Card>
              </li>
            ))}
          </ul>

          {JSON.stringify(query)}

          <nav>
            {currentPage > 1 && (
              <Link to={`/?${previousParams.toString()}`}>Previous Page</Link>
            )}
            {currentPage < lastPage && (
              <Link to={`/?${nextParams.toString()}`}>Next Page</Link>
            )}
          </nav>
        </>
      )}
    </div>
  );
}
