import React from 'react';
import { Link, useSearchParams } from '@remix-run/react';

/**
 * @type {React.FC<{
 * totalPages: number|string
 * pageParam?: string
 * }>}
 */
const Pagination = ({
  totalPages = Number.MAX_SAFE_INTEGER,
  pageParam = 'page',
  className = '',
  ...attrs
}) => {
  const [queryParams] = useSearchParams();
  const currentPage = Number(queryParams.get(pageParam) || 1);
  totalPages = Number(totalPages);

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
