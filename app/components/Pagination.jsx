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

  const previousParams = new URLSearchParams(queryParams);
  previousParams.set('page', page - 1);
  const nextParams = new URLSearchParams(queryParams);
  nextParams.set('page', page + 1);
  const lastPage = Math.ceil(total / perPage);

  return (
    <nav
      className={['flex justify-between', className].filter(Boolean).join(' ')}
      {...attrs}
    >
      {page <= 1 && <span>Previous Page</span>}
      {page > 1 && (
        <Link to={`/?${previousParams.toString()}`}>Previous Page</Link>
      )}

      {page >= lastPage && <span>Next Page</span>}
      {page < lastPage && (
        <Link to={`/?${nextParams.toString()}`}>Next Page</Link>
      )}
    </nav>
  );
};

export default Pagination;
