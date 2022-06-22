import React from 'react';
import { Link } from '@remix-run/react';
import qs from 'qs';

/**
 * @type {React.FC<{
 * page: number|string,
 * perPage: number,
 * total: number,
 * params?: Record<string, string|number>
 * }>}
 */
const Pagination = ({ query, total, className = '', ...attrs }) => {
  /** @type {Awaited<ReturnType<typeof loader>>} */
  const { page, perPage } = query;

  const queryParams = new URLSearchParams(qs.stringify(query));

  queryParams.set('page', page - 1);
  const previousUrl = queryParams.toString();
  queryParams.set('page', page + 1);
  const nextUrl = queryParams.toString();
  const lastPage = Math.ceil(total / perPage);

  return (
    <nav
      className={['flex justify-between', className].filter(Boolean).join(' ')}
      {...attrs}
    >
      {page <= 1 && <span>Previous Page</span>}
      {page > 1 && <Link to={`?${previousUrl}`}>Previous Page</Link>}

      {page >= lastPage && <span>Next Page</span>}
      {page < lastPage && <Link to={`?${nextUrl}`}>Next Page</Link>}
    </nav>
  );
};

export default Pagination;
