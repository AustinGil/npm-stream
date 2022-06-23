import React from 'react';
import { Link } from '@remix-run/react';
import qs from 'qs';

/**
 * @type {React.FC<{
 * currentPage: number|string
 * totalPages: number|string
 * queryParams: Record<string, string|number>
 * pageParam?: string
 * }>}
 */
const Pagination = ({
  currentPage,
  totalPages,
  queryParams,
  pageParam = 'page',
  className = '',
  ...attrs
}) => {
  currentPage = Number(currentPage);
  totalPages = Number(totalPages);
  queryParams = new URLSearchParams(qs.stringify(queryParams));

  queryParams.set(pageParam, currentPage - 1);
  const previousUrl = queryParams.toString();
  queryParams.set(pageParam, currentPage + 1);
  const nextUrl = queryParams.toString();

  return (
    <nav
      className={['flex justify-between', className].filter(Boolean).join(' ')}
      {...attrs}
    >
      {currentPage <= 1 && <span>Previous Page</span>}
      {currentPage > 1 && <Link to={`?${previousUrl}`}>Previous Page</Link>}
      {currentPage >= totalPages && <span>Next Page</span>}
      {currentPage < totalPages && <Link to={`?${nextUrl}`}>Next Page</Link>}
    </nav>
  );
};

export default Pagination;
