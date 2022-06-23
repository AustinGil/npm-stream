import React from 'react';
import { Link } from '@remix-run/react';
/**
 * @type {React.FC<{
 * }>}
 */
const Card = ({
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
      className={[
        'card relative overflow-hidden rounded-2 bg-white shadow transition-all hover:shadow-lg focus-within:shadow-lg hover:scale-105 focus-within:scale-105',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...attrs}
    >
      {thumb && (
        <div className="aspect-square">
          <img
            src={thumb}
            alt={thumbAlt}
            loading="lazy"
            className="w-full h-full object-cover rounded-t"
          />
        </div>
      )}

      <div className="p-2">
        {title && (
          <h3 className="text-2xl">
            {to && (
              <Link
                to={to}
                className="static text-secondary before:absolute before:inset-0"
              >
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

export default Card;
