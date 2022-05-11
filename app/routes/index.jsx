import { useLoaderData, Link } from '@remix-run/react';
import db from '../db/index.js';
import Input from '../components/Input.jsx';

const DEFAULT_PER_PAGE = 10;

/** @type {import('@remix-run/node').LoaderFunction} */
export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const query = Object.fromEntries(searchParams.entries());
  query.perPage = query.perPage ? parseInt(query.perPage) : DEFAULT_PER_PAGE;
  query.perPage = Math.max(query.perPage, 1);
  query.page = query.page ? parseInt(query.page) - 1 : 0;
  query.page = Math.max(query.page, 0);

  /** @type {import('@prisma/client').Prisma.UserFindManyArgs} */
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
  console.log(query, params);
  return {
    query: query,
    data: {
      items: await db.user.findMany(params),
      count: await db.user.count(countParams),
    },
  };
};

export default function Index() {
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
        <Input
          id="search"
          label="Search"
          name="search"
          defaultValue={query.search || ''}
        />
        <button>Search</button>
      </form>
      {doggos.length && (
        <>
          <ul>
            {doggos.map((doggo) => (
              <li key={doggo.id}>
                <Link to={`/pet/${doggo.id}`}>{doggo.name}</Link>
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
