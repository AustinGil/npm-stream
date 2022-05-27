import React from 'react';
import { Link } from '@remix-run/react';
/**
 * @type {React.FC<{
 * }>}
 */
const Btn = ({
  title = '',
  to = '',
  thumb = '',
  thumbAlt,
  className,
  children,
  ...attrs
}) => {
  if (thumb && thumbAlt === undefined) console.warn('thumbAlt is required');

  return (
    <div
      className={['card relative overflow-hidden radius-8 bg-white', className]
        .filter(Boolean)
        .join(' ')}
      {...attrs}
    >
      {thumb && (
        <div className="aspect-3/2">
          <img
            src={thumb}
            alt={thumbAlt}
            loading="lazy"
            className="inline-size-full block-size-full fit-cover radius-t-4"
          />
        </div>
      )}

      <div className="p-8">
        {title && (
          <h3>
            {to && (
              <Link to={to} className="card__link">
                {title}
              </Link>
            )}
            {!to && title}
          </h3>
        )}
        {children}
      </div>
    </div>
  );
};

export default Btn;
